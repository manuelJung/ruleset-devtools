// @flow
import {observable, toJS} from 'mobx'
import events from '../events'
import * as t from '../types'
import {push} from 'utils/helpers'

export type RuleExecution = {
  storeType: 'RULE_EXECUTION',
  id: number,
  actionExecutions: t.ActionExecution[],
  rule: t.Rule,
  status: 'PENDING' | 'RESOLVED' | 'CONDITION_NOT_MATCH' | 'SKIP' | 'CONCURRENCY_REJECTION',
  toJs: () => RuleExecution
}

export default function createRuleExecution (
  event:t.ExecRuleStartEvent, 
  rootStore:t.RootStore
) {
  const store:RuleExecution = observable(({
    storeType: 'RULE_EXECUTION',
    id: event.ruleExecId,
    status: 'PENDING',

    get actionExecutions () {
      return rootStore.private.actionExecutions.byRuleExecId[event.ruleExecId] || []
    },

    get rule () {
      return rootStore.private.rules.byRuleId[event.ruleId]
    },

    toJs(){
      return toJS(this)
    }
  }:RuleExecution))

  // listeners
  const listener = events.addListener(e => {
    if(e.type === 'EXEC_RULE_END' && e.ruleExecId === event.ruleExecId){
      store.status = e.result
      events.removeListener(listener)
    }
  })

  // attach
  rootStore.private.ruleExecutions.byRuleExecId[store.id] = store
  if(event.actionExecId){
    push(rootStore.private.ruleExecutions.byActionExecId, event.actionExecId, store)
  }
}