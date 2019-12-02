// @flow
import {observable, toJS} from 'mobx'
import events from '../events'
import * as t from '../types'
import {push} from 'utils/helpers'

export type ActionExecution = {
  storeType: 'ACTION_EXECUTION',
  id: number,
  action: t.Action,
  dispatchedAction: t.DispatchedAction | null,
  assignedRuleExecutions: t.RuleExecution[],
  creatorRuleExecution: t.RuleExecution | null,
  sagaYields: t.SagaYield[],
  toJs: () => ActionExecution
}

export default function createRule (
  event:t.ExecActionStartEvent, 
  rootStore:t.RootStore
) {
  const store:ActionExecution = observable(({
    storeType: 'ACTION_EXECUTION',
    id: event.actionExecId,

    get action(){
      return rootStore.private.actions.byActionType[event.action.type]
    },
    get dispatchedAction(){
      return rootStore.private.dispatchedActions.byActionExecId[event.actionExecId]
    },
    get assignedRuleExecutions(){
      return rootStore.private.ruleExecutions.byActionExecId[event.actionExecId]
    },
    get sagaYields(){
      return rootStore.private.sagaYields.byActionExecId[event.actionExecId]
    },
    get creatorRuleExecution(){
      if(!event.ruleExecId) return null
      return rootStore.private.ruleExecutions.byRuleExecId[event.ruleExecId] || null
    },
    
    toJs(){
      return toJS(this)
    }
  }:ActionExecution))

  // listeners
  const listener = events.addListener(e => {})

  // attach
  rootStore.private.actionExecutions.byActionExecId[store.id] = store
  push(rootStore.private.actionExecutions.byActionType, event.action.type, store)
}