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
  canceled: boolean,
  assignedRuleExecutions: t.RuleExecution[],
  creatorRuleExecution: t.RuleExecution | null,
  sagaYields: t.SagaYield[],
  toJs: () => ActionExecution
}

export default function createRule (
  event:t.ExecActionStartEvent, 
  rootStore:t.RootStore,
  eventId: number
) {
  const store:ActionExecution = observable(({
    storeType: 'ACTION_EXECUTION',
    id: event.actionExecId,
    canceled: false,

    get action(){
      return rootStore.private.actions.byActionType[event.action.type]
    },
    get dispatchedAction(){
      return rootStore.private.dispatchedActions.byActionExecId[event.actionExecId]
    },
    get assignedRuleExecutions(){
      const ruleExecutions = rootStore.private.ruleExecutions.byActionExecId[event.actionExecId] || []
      return ruleExecutions
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
  const listener = events.addListener(e => {
    if(e.type === 'EXEC_ACTION_END' && e.actionExecId === event.actionExecId){
      if(e.result === 'ABORTED'){
        store.canceled = true
      }
    }
  })

  // attach
  rootStore.private.actionExecutions.byActionExecId[store.id] = store
  push(rootStore.private.actionExecutions.byActionType, event.action.type, store)
  if(event.ruleExecId !== null){
    push(rootStore.private.actionExecutions.byRuleExecId, event.ruleExecId, store)
  }
}