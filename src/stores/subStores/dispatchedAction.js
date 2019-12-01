// @flow
import {observable, toJS} from 'mobx'
import events from '../events'
import * as t from '../types'

export type DispatchedAction = {
  storeType: 'DISPATCHED_ACTION',
  id: number,
  actionExecution: t.ActionExecution,
  data: {type:string},
  toJs: () => DispatchedAction
}

export default function createDispatchedAction (
  event:t.DispatchActionEvent, 
  rootStore:t.RootStore
) {
  const store:DispatchedAction = observable(({
    storeType: 'DISPATCHED_ACTION',
    id: event.actionExecId,
    data: event.action,

    get actionExecution () {
      return rootStore.private.actionExecutions.byActionExecId[event.actionExecId]
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