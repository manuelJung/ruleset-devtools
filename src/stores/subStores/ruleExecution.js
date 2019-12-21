// @flow
import {observable, toJS} from 'mobx'
import events from '../events'
import * as t from '../types'
import {push} from 'utils/helpers'

export type RuleExecution = {
  storeType: 'RULE_EXECUTION',
  id: number,
  startEventId: number,
  targetActionExecution: t.ActionExecution | null,
  outputActionExecutions: t.ActionExecution[],
  rule: t.Rule,
  status: 'PENDING' | 'RESOLVED' | 'CONDITION_NOT_MATCH' | 'SKIP' | 'CONCURRENCY_REJECTION',
  toJs: () => RuleExecution
}

export default function createRuleExecution (
  event:t.ExecRuleStartEvent, 
  rootStore:t.RootStore,
  eventId: number
) {
  const store:RuleExecution = observable(({
    storeType: 'RULE_EXECUTION',
    id: event.ruleExecId,
    status: 'PENDING',
    startEventId: eventId,

    get targetActionExecution () {
      if(!event.actionExecId) return null
      return rootStore.private.actionExecutions.byActionExecId[event.actionExecId] || null
    },

    get outputActionExecutions () {
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
  events.addListenerByEventName('EXEC_RULE_END', 'ruleExecId', event.ruleExecId, event => {
    if(event.type !== 'EXEC_RULE_END') return
    store.status = event.result
  })

  // attach
  rootStore.private.ruleExecutions.byRuleExecId[store.id] = store
  push(rootStore.private.ruleExecutions.byRuleId, event.ruleId, store)
  if(event.actionExecId){
    push(rootStore.private.ruleExecutions.byActionExecId, event.actionExecId, store)
  }
}