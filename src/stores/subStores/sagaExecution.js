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
  endEventId: number | null,
  status: 'PENDING' | 'RESOLVED' | 'ABORTED',
  result: 'PENDING' | 'CANCELED' | 'ADD_RULE' | 'ABORT' | 'REAPPLY_WHEN' | 'ADD_RULE_BEFORE' | 'RECREATE_RULE' | 'REMOVE_RULE' | 'REAPPLY_REMOVE' | 'ABORT',
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
    endEventId: null,
    type: event.sagaType,
    status: 'PENDING',
    result: 'PENDING',

    toJs(){
      return toJS(this)
    }
  }:SagaExecution))

  // listeners
  events.addListenerByEventName('EXEC_SAGA_END', 'sagaId', event.sagaId, (event,eventId) => {
    if(event.type !== 'EXEC_SAGA_END') return
    store.result = event.result
    store.endEventId = eventId
    store.status = event.result === 'CANCELED' ? 'ABORTED' : 'RESOLVED'
  })

  // attach
  rootStore.private.sagaExecutions.bySagaExecId[store.id] = store
  push(rootStore.private.sagaExecutions.byRuleId, event.ruleId, store)
}