// @flow
import {observable, toJS} from 'mobx'
import events from '../events'
import * as t from '../types'
import {push} from 'utils/helpers'

export type SagaYield = {
  storeType: 'SAGA_YIELD',
  // sagaExecution: t.SagaExecution,
  // rule: t.Rule,
  toJs: () => SagaYield
}

export default function createSagaYield (
  event:t.YieldSagaEvent, 
  rootStore:t.RootStore
) {
  const store:SagaYield = observable(({
    storeType: 'SAGA_YIELD',

    toJs(){
      return toJS(this)
    }
  }:SagaYield))

  // listeners
  const listener = events.addListener(e => {})

  // attach
  push(rootStore.private.sagaYields.bySagaExecId, event.sagaId, store)
}