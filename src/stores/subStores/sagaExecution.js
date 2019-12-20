// @flow
import {observable, toJS} from 'mobx'
import events from '../events'
import * as t from '../types'

export type SagaExecution = {
  storeType: 'SAGA_EXECUTION',
  id: number,
  // status: 'PENDING' | 'RESOLVED' | 'ABORTED',
  // saga: t.Saga,
  // rule: t.Rule,
  // sagaYields: t.SagaYield[],
  toJs: () => SagaExecution
}

export default function createSagaExecution (
  event:t.ExecSagaStartEvent, 
  rootStore:t.RootStore,
  eventId: number
) {
  const store:SagaExecution = observable(({
    storeType: 'SAGA_EXECUTION',
    id: event.sagaId,

    toJs(){
      return toJS(this)
    }
  }:SagaExecution))

  // listeners
  const listener = events.addListener(e => {})

  // attach
  rootStore.private.sagaExecutions.bySagaExecId[store.id] = store
}