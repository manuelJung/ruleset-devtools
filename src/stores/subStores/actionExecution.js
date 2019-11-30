// @flow
import {observable, toJS} from 'mobx'
import events from '../events'
import * as t from '../types'
import {push} from 'utils/helpers'

export type ActionExecution = {
  storeType: 'ACTION_EXECUTION',
  id: number,
  action: t.Action,
  ruleExecution: t.RuleExecution | void
}

export default function createRule (
  event:t.ExecActionStartEvent, 
  rootStore:t.RootStore
) {
  const store:ActionExecution = observable(({
    storeType: 'ACTION_EXECUTION',
    id: event.actionExecId,

    get action(){
      return rootStore.private.actions.byActionType[event.action.type]
    },
    get ruleExecution(){
      return rootStore.private.ruleExecutions.byActionExecId[event.actionExecId]
    },
    get sagas(){
      return []
    },
    
    toJs(){
      return toJS(this)
    }
  }:ActionExecution))

  // listeners
  const listener = events.addListener(e => {})

  // attach
  rootStore.private.actionExecutions.byActionExecId[store.id] = store
  push(rootStore.private.actionExecutions.byActionType[event.action.type], store)
}