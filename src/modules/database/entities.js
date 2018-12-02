// @flow
import type {Rule} from './redux-ruleset.types'

export type RuleExecution = {
  id: string,
  ruleid: string,
  timestamp: mixed,
  finished: boolean,
  actionExecutionIds: string[], // ids of executed actions
}

export type ActionExecution = {
  id: string,
  action: {key:string},
  ruleExecutionId: string,
  timestamp: mixed
}

export type Ruleset = {
  id: string,
  rule: mixed,
  pendingWhen: boolean,
  pendingUntil: boolean,
  executionIds: string[],
  creationRuleId: string | null,
  subRuleIds: string[]
}


// ACTIONS

export type ExecRuleAction = {
  type: 'EXEC_RULE',
  meta: {id:string, timestamp:mixed, ruleId:string},
  payload: 'SKIP_RULE' | 'NO_CONDITION_MATCH' | 'CONDITION_MATCH'
}

export type ExecActionAction = {
  type: 'EXEC_ACTION',
  meta: {
    id: string,
    executionId: string,
    timestamp: mixed,
    ruleId: string | null,
  },
  payload: {type:string}
}

export type Action = {type:'INIT'} 
| ExecRuleAction 
| ExecActionAction


