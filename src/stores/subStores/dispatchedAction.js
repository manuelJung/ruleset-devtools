// @flow
import {observable, toJS} from 'mobx'
import events from '../events'
import * as t from '../types'

export type DispatchedAction = {
  storeType: 'DISPATCHED_ACTION',
  id: number
}

export default function createAction (
  event:t.DispatchActionEvent, 
  rootStore:t.RootStore
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