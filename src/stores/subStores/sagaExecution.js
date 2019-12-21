// @flow
import {observable, toJS} from 'mobx'
import events from '../events'
import * as t from '../types'
import {push} from 'utils/helpers'

export type SagaExecution = {
  storeType: 'SAGA_EXECUTION',
  id: number,
  type: 'ADD_WHEN' | 'ADD_UNTIL',
  startEventId: number,
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
    startEventId: eventId,
    type: event.sagaType,

    toJs(){
      return toJS(this)
    }
  }:SagaExecution))

  // listeners

  // attach
  rootStore.private.sagaExecutions.bySagaExecId[store.id] = store
  push(rootStore.private.sagaExecutions.byRuleId, event.ruleId, store)
}