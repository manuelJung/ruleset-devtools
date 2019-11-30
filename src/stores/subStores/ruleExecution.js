// @flow
import {observable, toJS} from 'mobx'
import events from '../events'
import type {ExecRuleStartEvent} from '../events'
import type {RootStore} from '../root'
import type {Rule} from './rule'
import type {ActionExecution} from './actionExecution'

export type RuleExecution = {
  storeType: 'RULE_EXECUTION',
  id: number,
  actionExecutions: ActionExecution[],
  rule: Rule
}

export default function createAction (
  event:ExecRuleStartEvent, 
  rootStore:RootStore
) {
  const store:RuleExecution = observable(({
    storeType: 'RULE_EXECUTION',
    id: event.ruleExecId,

    get actionExecutions () {
      return rootStore.private.actionExecutions.byRuleExecId[event.ruleExecId] || []
    },

    get rule () {
      return rootStore.private.rules.byRuleId[event.ruleId]
    }
  }:RuleExecution))

  // listeners
  const listener = events.addListener(e => {})

  // attach
  rootStore.private.ruleExecutions.byRuleExecId[store.id] = store
  if(event.actionExecId){
    rootStore.private.ruleExecutions.byActionExecId[event.actionExecId] = store
  }
}