// @flow
import {observable, toJS} from 'mobx'
import events from '../events'
import * as t from '../types'

export type DispatchedAction = {
  storeType: 'DISPATCHED_ACTION',
  id: number,
  toJs: () => DispatchedAction
}

export default function createAction (
  event:t.DispatchActionEvent, 
  rootStore:t.RootStore
) {
  const store:DispatchedAction = observable(({
    storeType: 'DISPATCHED_ACTION',
    id: event.actionExecId,

    toJs(){
      return toJS(this)
    }
  }:DispatchedAction))

  // listeners
  const listener = events.addListener(e => {})

  // attach
  rootStore.private.dispatchedActions.byDispatchedActionId[store.id] = store
}