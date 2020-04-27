// @flow
import {observable, toJS} from 'mobx'
import events from '../events'
import * as t from '../types'
import {push} from 'utils/helpers'

export type SagaYield = {
  storeType: 'SAGA_YIELD',
  sagaType: 'ADD_WHEN' | 'ADD_UNTIL',
  result: 'REJECT' | 'RESOLVE',
  rule: t.Rule,
  eventId: number,
  actionExecution: t.ActionExecution | null,
  // sagaExecution: t.SagaExecution,
  // rule: t.Rule,
  toJs: () => SagaYield
}

export default function createSagaYield (
  event:t.YieldSagaEvent, 
  rootStore:t.RootStore,
  eventId: number
) {
  const store:SagaYield = observable(({
    storeType: 'SAGA_YIELD',
    sagaType: event.sagaType,
    result: event.result,
    eventId: eventId,
    
    get actionExecution () {
      return rootStore.private.actionExecutions.byActionExecId[event.actionExecId]
    },
    
    get rule () {
      return rootStore.private.rules.byRuleId[event.ruleId]
    },

    toJs(){
      return toJS(this)
    }
  }:SagaYield))

  // listeners

  // attach
  push(rootStore.private.sagaYields.bySagaExecId, event.sagaId, store)
  push(rootStore.private.sagaYields.byActionExecId, event.actionExecId, store)
  push(rootStore.private.sagaYields.byRuleId, event.ruleId, store)
}