// @flow
import {observable, toJS} from 'mobx'
import events from '../events'
import type {RegisterRuleEvent} from '../events'
import type {RootStore} from '../root'
import type {Action} from './action'
import {push} from 'utils/helpers'

export type Rule = {
  storeType: 'RULE',
  id: string,
  targetActions: Action[],
  outputActions: Action[],
  sagas: Saga[],
  toJs: () => Rule
}

export default function createRule (
  event:RegisterRuleEvent, 
  rootStore:RootStore
) {
  const store:Rule = observable(({
    storeType: 'RULE',
    id: event.rule.id,

    get targetActions(){
      const {target} = event.rule
      if(target === '*'){
        return []
      }
      if(typeof target === 'string'){
        return [rootStore.private.actions.byActionType[target]] || []
      }
      if(Array.isArray(target)){
        let result = []
        let actionsByType = rootStore.private.actions.byActionType
        target.forEach(type => result.push(...(actionsByType[type] || [])))
        return result
      }
      return []
    },
    get outputActions(){
      const {output} = event.rule
      if(!output) return []
      if(output === '*'){
        return []
      }
      if(typeof output === 'string'){
        return [rootStore.private.actions.byActionType[output]] || []
      }
      if(Array.isArray(output)){
        let result = []
        let actionsByType = rootStore.private.actions.byActionType
        output.forEach(type => result.push(...(actionsByType[type] || [])))
        return result
      }
      return []
    },
    get sagas(){
      return []
    },
    
    toJs(){
      return toJS(this)
    }
  }:Rule))

  // listeners
  const listener = events.addListener(e => {})

  // attach
  const {target, output} = event.rule
  rootStore.private.rules.byRuleId[store.id] = store
  if(target === '*'){

  }
  else if(typeof target === 'string'){
    push(rootStore.private.rules.byRuleTarget[target], store)
  }
  else if(Array.isArray(target)){
    target.forEach(type => push(rootStore.private.rules.byRuleTarget[type], store))
  }

  if(!output){}
  else if(typeof output === 'string'){
    push(rootStore.private.rules.byRuleOutput[output], store)
  }
  else if(Array.isArray(output)){
    output.forEach(type => push(rootStore.private.rules.byRuleOutput[type], store))
  }
}