// @flow
import {observable, toJS} from 'mobx'
import * as t from '../types'

export type Action = {
  storeType: 'ACTION',
  type: string,
  attachedRules: t.Rule[],
  creatorRules: t.Rule[],
  executions: t.ActionExecution[],
  toJs: () => Action
}

export default function createAction (
  event:t.RegisterRuleEvent, 
  rootStore:t.RootStore,
  eventId: number
) {
  [...flatten(event.rule.target), ...flatten(event.rule.output)].forEach(type => {
    if(rootStore.private.actions.byActionType[type]) return
    const store:Action = observable(({
      storeType: 'ACTION',
      type: type,

      get attachedRules(){
        const rules = rootStore.private.rules.byRuleTarget[type] || []
        return rules.sort((a,b) => {
          if(a.position === 'INSTEAD' && b.position !== 'INSTEAD') return -1
          if(b.position === 'INSTEAD' && a.position !== 'INSTEAD') return 1
          if(a.position === 'BEFORE' && b.position !== 'BEFORE') return -1
          if(b.position === 'BEFORE' && a.position !== 'BEFORE') return 1
          return a.weight > b.weight ? 1 : -1
        })
      },
      get creatorRules(){
        const rules = rootStore.private.rules.byRuleOutput[type] || []
        return rules.filter(rule => rule.position !== 'INSTEAD')
      },
      get executions(){
        return rootStore.private.actionExecutions.byActionType[type] || []
      },
      
      toJs(){
        return toJS(this)
      }
    }:Action))

    // attach
    rootStore.private.actions.byActionType[store.type] = store
  })

}

function flatten (list?:string|string[]|'*'){
  if(!list) return []
  if(list === '*') return []
  if(typeof list === 'string') return [list]
  else return list
}