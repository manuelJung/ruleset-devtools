// @flow
import {observable, toJS} from 'mobx'
import events from '../events'
import * as t from '../types'
import {push} from 'utils/helpers'

export type Rule = {
  storeType: 'RULE',
  id: string,
  position: 'AFTER' | 'BEFORE' | 'INSTEAD',
  status: 'ACTIVE' | 'REMOVED' | 'INACTIVE',
  targetActions: t.Action[],
  outputActions: t.Action[],
  // sagas: Saga[],
  toJs: () => Rule
}

export default function createRule (
  event:t.RegisterRuleEvent, 
  rootStore:t.RootStore
) {
  if(rootStore.private.rules.byRuleId[event.rule.id]) return
  const store:Rule = observable(({
    storeType: 'RULE',
    id: event.rule.id,
    position: event.rule.position || 'AFTER',
    status: event.rule.addWhen ? 'INACTIVE' : 'ACTIVE',

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
        target.forEach(type => result.push(actionsByType[type]))
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
        output.forEach(type => result.push(actionsByType[type]))
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
    push(rootStore.private.rules.byRuleTarget, target, store)
  }
  else if(Array.isArray(target)){
    target.forEach(type => push(rootStore.private.rules.byRuleTarget, type, store))
  }

  if(!output){}
  else if(typeof output === 'string'){
    push(rootStore.private.rules.byRuleOutput, output, store)
  }
  else if(Array.isArray(output)){
    output.forEach(type => push(rootStore.private.rules.byRuleOutput, type, store))
  }
}