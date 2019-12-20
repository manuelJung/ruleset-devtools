// @flow
import {observable, toJS} from 'mobx'
import events from '../events'
import * as t from '../types'

export type DispatchedAction = {
  storeType: 'DISPATCHED_ACTION',
  id: number,
  actionExecution: t.ActionExecution,
  assignedRuleExecutions: t.RuleExecution[],
  sagaYields: t.SagaYield[],
  data: {type:string},
  toJs: () => DispatchedAction
}

export default function createDispatchedAction (
  event:t.DispatchActionEvent, 
  rootStore:t.RootStore,
  eventId: number
) {
  const store:DispatchedAction = observable(({
    storeType: 'DISPATCHED_ACTION',
    id: event.actionExecId,
    data: event.action,

    get actionExecution () {
      return rootStore.private.actionExecutions.byActionExecId[event.actionExecId]
    },

    get assignedRuleExecutions () {
      return store.actionExecution.assignedRuleExecutions || []
    },

    get sagaYields () {
      return store.actionExecution.sagaYields || []
    },

    toJs(){
      return toJS(this)
    }
  }:DispatchedAction))

  // listeners
  const listener = events.addListener(e => {})

  // attach
  rootStore.private.dispatchedActions.byActionExecId[event.actionExecId] = store
  rootStore.private.dispatchedActions.ordered.push(store)
}