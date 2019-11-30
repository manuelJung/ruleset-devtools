// @flow
import {observable, toJS} from 'mobx'
import events from '../events'
import type {DispatchActionEvent} from '../events'
import type {RootStore} from '../root'
import type {Rule} from './rule'
import type {ActionExecution} from './actionExecution'

export type DispatchedAction = {
  storeType: 'DISPATCHED_ACTION',
  id: number
}

export default function createAction (
  event:DispatchActionEvent, 
  rootStore:RootStore
) {
  const store:DispatchedAction = observable(({
    storeType: 'DISPATCHED_ACTION',
    id: event.actionExecId,
  }:DispatchedAction))

  // listeners
  const listener = events.addListener(e => {})

  // attach
  rootStore.private.dispatchedActions.byDispatchedActionId[store.id] = store
}