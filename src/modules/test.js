// @flow
import {observable, toJS} from 'mobx'
import events from './events'
import {push} from 'utils/helpers'

// import type {DispatchedAction, ActionExecution, RuleExecution, Ruleset, SagaStore, SagaYieldStore} from './entities'

type Action = {
  storeType: 'ACTION',
  type: string,
  attachedRules: Rule[],
  creatorRules: Rule[],
  executions: ActionExecution[]
}

type Rule = {
  storeType: 'RULE',
  id: string,
  targetActions: Action[],
  outputActions: Action[],
  sagas: Saga[]
}

type ActionExecution = {
  storeType: 'ACTION_EXECUTION',
  id: number,
  action: Action,
  ruleExecution: RuleExecution | void
}

type DispatchedAction = {
  storeType: 'DISPATCHED_ACTION',
  id: number
}

type RuleExecution = {
  storeType: 'RULE_EXECUTION',
  id: number,
  actionExecutions: ActionExecution[],
  rule: Rule
}

type Saga = {
  storeType: 'SAGA',
  id: number,
  type: 'ADD_WHEN' | 'ADD_UNTIL',
  rule: Rule,
  sagaExecutions: SagaExecution[]
}

type SagaExecution = {
  storeType: 'SAGA_EXECUTION',
  id: number,
  status: 'PENDING' | 'RESOLVED' | 'ABORTED',
  saga: Saga,
  rule: Rule,
  sagaYields: SagaYield[]
}

type SagaYield = {
  storeType: 'SAGA_YIELD',
  id: number,
  sagaExecution: SagaExecution,
  rule: Rule
}

type DataStore = {
  private: {
    actions: {
      byActionType: {[string] : Action},
      byRuleTarget: {[string]: Action[]},
      byRuleOutput: {[string]: Action[]},
      byActionExecId: {[number]: Action}
    },
    rules: {
      byRuleId: {[string] : Rule},
      byRuleTarget: {[string]: Rule[]},
      byRuleOutput: {[string]: Rule[]},
      bySagaId: {[number]: Rule},
      bySagaExecId: {[number]: Rule},
      bySagaYieldId: {[number]: Rule}
    },
    sagas: {
      bySagaId: {[number]:Saga},
      byRuleId: {[string]: Saga[]}
    },
    actionExecutions: {
      byActionExecId: {[number]: ActionExecution},
      byActionType: {[string]: ActionExecution[]},
      byRuleExecutionId: {[string]: ActionExecution[]},
    },
    dispatchedActions: {
      byDispatchedActionId: {[number]: DispatchedAction}
    },
    ruleExecutions: {
      byRuleExecId: {[number]: RuleExecution},
      byRuleId: {[string]: RuleExecution[]},
      byActionExecId: {[number]: RuleExecution},
    },
    sagaExecutions: {
      bySagaExecId: {[number]: SagaExecution},
      bySagaId: {[number]: SagaExecution[]},
      bySagaYieldId: {[number]: SagaExecution}
    },
    sagaYields: {
      bySagaYieldId: {[number]: SagaYield},
      bySagaExecId: {[number]: SagaYield[]},
      byActionExecId: {[number]: SagaYield[]}
    }
  },
  toJS: (store?:any) => DataStore
}

type RouterStore = {
  route: Route,
  history: Route[],
  push: (ctx:Route) => void,
  replace: (ctx:Route) => void,
  go: (n:number) => void,
  pop: () => void
}

type EmptyRoute = {
  type: 'EMPTY'
}

type RuleListRoute = {
  type: 'RULE_LIST',
  activeRule?: Rule
}

type GrapRoute = {
  type: 'GRAPH'
}

type ExecutedRulesRoute = {
  type: 'EXECUTED_RULES',
  dispatchedAction: DispatchedAction
}

type ExecutedSagasRoute = {
  type: 'EXECUTED_SAGAS',
  dispatchedAction: DispatchedAction
}

type DispatchedActionRoute = {
  type: 'DISPATCHED_ACTION',
  dispatchedAction: DispatchedAction
}

type Route = EmptyRoute 
| RuleListRoute 
| GraphRoute 
| ExecutedRulesRoute 
| ExecutedSagasRoute 
| DispatchedActionRoute