// @flow

// STORES

export type DispatchedAction = {
  storeType: 'DISPATCHED_ACTION',
  actionExecution: ActionExecution,
  actionExecId: number,
  timestamp: number,
  removed: boolean,
  isReduxAction: boolean,
  action: Action
}

export type RuleExecution = {
  storeType: 'RULE_EXECUTION',
  id: number,
  timestampStart: number,
  timestampEnd: number | null,
  finished: boolean,
  status: 'RESOLVED' | 'CONDITION_NOT_MATCH' | 'SKIP' | 'CONCURRENCY_REJECTION' | 'PENDING',
  ruleset: Ruleset,
  actionExecutions: ActionExecution[], // ids of executed actions
}

export type ActionExecution = {
  storeType: 'ACTION_EXECUTION',
  id: number,
  timestampStart: number,
  timestampEnd: number | null,
  action: Action,
  dispatchedAction: DispatchedAction,
  assignedRuleExecutions: RuleExecution[],
  assignedSagaYields: SagaYieldStore[],
  ruleExecution: RuleExecution | null,
  status: 'PENDING' | 'DISPATCHED' | 'ABORTED'
}

export type Ruleset = {
  storeType: 'RULESET',
  id: string,
  rule: Rule,
  active: boolean,
  addWhenSaga: null,
  addUntilSaga: null,
  parentRuleset: Ruleset | null,
  subRules: Rule[],
  ruleExecutions: RuleExecution[],
}

export type SagaStore = {
  storeType: 'SAGA_STORE',
  timestampStart: number,
  timestampEnd: number | null,
  type: 'ADD_WHEN' | 'ADD_UNTIL',
  active: boolean,
  status: 'PENDING' | 'CANCELED' | LogicAdd | LogicRemove,
  yields: SagaYieldStore[]
}

export type SagaYieldStore = {
  storeType: 'SAGA_YIELD_STORE',
  timestamp: number,
  action: Action,
  result: 'REJECT' | 'RESOLVE'
}

export type Store = RuleExecution | ActionExecution | Ruleset | SagaStore | SagaYieldStore

// EVENTS

export type AddRuleEvent = {
  type: 'ADD_RULE',
  timestamp: number,
  rule: Rule,
  parentRuleId: string | null
}

export type RemoveRuleEvent = {
  type: 'REMOVE_RULE',
  timestamp: number,
  ruleId: string,
  removedByParent: boolean
}

export type ExecRuleStartEvent = {
  type: 'EXEC_RULE_START',
  timestamp: number,
  ruleExecId: number,
  ruleId: string,
  actionExecId: number | null,
  concurrencyFilter: string
}

type ExecRuleEventResult = 'RESOLVED' | 'CONDITION_NOT_MATCH' | 'SKIP' | 'CONCURRENCY_REJECTION'
export type ExecRuleEndEvent = {
  type: 'EXEC_RULE_END',
  timestamp: number,
  ruleExecId: number,
  ruleId: string,
  actionExecId: number | null,
  concurrencyFilter: string,
  result: ExecRuleEventResult
}

export type ExecActionStartEvent = {
  type: 'EXEC_ACTION_START',
  timestamp: number,
  actionExecId: number,
  ruleExecId: number | null,
  action: Action
}

export type ExecActionEndEvent = {
  type: 'EXEC_ACTION_END',
  timestamp: number,
  actionExecId: number,
  ruleExecId: number | null,
  action: Action,
  result: 'DISPATCHED' | 'ABORTED'
}

export type ExecSagaStartEvent = {
  type: 'EXEC_SAGA_START',
  timestamp: number,
  sagaId: number,
  ruleId: string,
  sagaType: 'ADD_WHEN' | 'ADD_UNTIL'
}

type ExecSagaEventResult = 'CANCELED' | LogicAdd | LogicRemove
export type ExecSagaEndEvent = {
  type: 'EXEC_SAGA_END',
  timestamp: number,
  sagaId: number,
  ruleId: string,
  sagaType: 'ADD_WHEN' | 'ADD_UNTIL',
  result: ExecSagaEventResult
}

export type YieldSagaEvent = {
  type: 'YIELD_SAGA',
  timestamp: number,
  sagaId: number,
  ruleId: string,
  sagaType: 'ADD_WHEN' | 'ADD_UNTIL',
  action: Action,
  ruleExecId: number | null,
  actionExecId: number,
  result: 'REJECT' | 'RESOLVE'
}

export type DispatchActionEvent = {
  type: 'DISPATCH_ACTION',
  timestamp: number,
  actionExecId: number,
  removed: boolean,
  isReduxAction: boolean,
  action: Action
}

export type Event = AddRuleEvent 
| RemoveRuleEvent 
| ExecRuleStartEvent 
| ExecRuleEndEvent 
| ExecActionStartEvent 
| ExecActionEndEvent 
| ExecSagaStartEvent 
| ExecSagaEndEvent 
| YieldSagaEvent
| DispatchActionEvent


// REDUX-RULESET

export type Action = { 
  type: string,
  meta?: { skipRule?: '*' | string | string[], }
}
export type GetState = () => {}
export type Dispatch = (action:Action) => Action
export type ReduxStore = {
  getState: GetState,
  dispatch: Dispatch
}

export type Position = 'INSERT_BEFORE' | 'INSERT_INSTEAD' | 'INSERT_AFTER'

export type LogicAdd = 'ADD_RULE' | 'ABORT' | 'REAPPLY_WHEN' | 'ADD_RULE_BEFORE'

export type LogicRemove = 'RECREATE_RULE' | 'REMOVE_RULE' | 'REAPPLY_REMOVE' | 'ABORT'

export type LogicConcurrency = 'DEFAULT' | 'FIRST' | 'LAST' | 'DEBOUNCE' | 'THROTTLE' | 'ONCE'

export type Saga<Logic> = (
  condition: (cb?:(action:Action) => mixed) => Promise<void>,
  getState: GetState
) => Promise<Logic>

export type Rule = {
  id: string,
  target: '*' | string | string[],
  position?: Position,
  zIndex?: number,
  meta?: {
    throttle?: number,
    debounce?: number
  },
  concurrency?: LogicConcurrency,
  condition?: (action:Action, getState:GetState) => boolean,
  consequence: (store:ReduxStore, action:Action, {addRule:AddRule,removeRule:RemoveRule}) => Action | Promise<Action> | Promise<void> | void | (getState:GetState) => mixed,
  addOnce?: boolean,
  addWhen?: Saga<LogicAdd>,
  addUntil?: Saga<LogicRemove>,
}

export type RuleContext = {
  rule: Rule,
  childRules: Rule[],
  running: number,
  pendingWhen: boolean,
  pendingUntil: boolean,
  cancelRule: (key?:string) => mixed,
  addCancelListener: (cb:(key:string)=>boolean, key?:string) => mixed,
  removeCancelListener: (cb:(key:string)=>boolean) => mixed
}

export type AddRule = (rule:Rule) => Rule | false

export type RemoveRule = (rule:Rule) => Rule | false




