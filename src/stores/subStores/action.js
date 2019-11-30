// @flow
import {observable, toJS} from 'mobx'
import events from '../events'
import type {RegisterRuleEvent} from '../events'
import type {RootStore} from '../root'
import type {Rule} from './rule'
import type {ActionExecution} from './actionExecution'

export type Action = {
  storeType: 'ACTION',
  type: string,
  attachedRules: Rule[],
  creatorRules: Rule[],
  executions: ActionExecution[],
  toJs: () => Action
}

export default function createAction (
  event:RegisterRuleEvent, 
  rootStore:RootStore,
  type: string
) {
  if(rootStore.private.actions.byActionType[type]) return
  const store:Action = observable(({
    storeType: 'ACTION',
    type: type,

    get attachedRules(){
      return rootStore.private.rules.byRuleTarget[type] || []
    },
    get creatorRules(){
      return rootStore.private.rules.byRuleOutput[type] || []
    },
    get executions(){
      return rootStore.private.actionExecutions.byActionType[type] || []
    },
    
    toJs(){
      return toJS(this)
    }
  }:Action))

  // listeners
  const listener = events.addListener(e => {})

  // attach
  rootStore.private.actions.byActionType[store.type] = store
}