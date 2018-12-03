// @flow

// STORES

export type RuleExecution = {
  storeType: 'RULE_EXECUTION',
  id: string,
  ruleId: string,
  timestamp: number,
  finished: boolean,
  status: 'CONDITION_MATCH' | 'NO_CONDITION_MATCH' | 'SKIP_RULE',
  rule: Rule,
  actionExecutions: ActionExecution[], // ids of executed actions
}

export type ActionExecution = {
  storeType: 'ACTION_EXECUTION',
  id: string,
  timestamp: number,
  action: Action,
  assignedRuleExecutions: RuleExecution[],
  ruleExecution: RuleExecution | null,
}

export type Ruleset = {
  storeType: 'RULESET',
  id: string,
  rule: Rule,
  active: boolean,
  pendingWhen: boolean,
  pendingUntil: boolean,
  parentRule: Rule | null,
  subRules: Rule[],
  ruleExecutions: RuleExecution[],
}

export type Store = RuleExecution | ActionExecution | Ruleset

// EVENTS

export type AddRuleEvent = {
  type: 'ADD_RULE',
  meta: {id:string, timestamp:number},
  payload: Rule
}
export type ExecRuleEvent = {
  type: 'EXEC_RULE',
  meta: { 
    id: string, 
    timestamp: number, 
    ruleId: string,
    actionId: string,
  },
  payload: 'NO_CONDITION_MATCH' | 'SKIP_RULE' | 'CONDITION_MATCH'
}
export type ActionEvent = {
  type: 'ACTION',
  meta: { 
    id: string, 
    executionId: string | null, 
    ruleId: string | null, 
    timestamp: 0 
  },
  payload: Action
}

export type Event = AddRuleEvent | ExecRuleEvent | ActionEvent


// REDUX-RULESET

export type Action = {type:string}

export type Rule = {
  id: string,
  target: '*' | string | string[],
  position: 'INSERT_BEFORE' | 'INSERT_INSTEAD' | 'INSERT_AFTER',
  zIndex?: number,
  condition?: string,
  consequence: string,
  addOnce?: boolean,
  addWhen?: string,
  addUntil?: string,
}




