// @flow
import {observable, toJS} from 'mobx'
import events from './events'
import type {Rule} from './subStores/rule'
import createRule from './subStores/rule'
import type {Action} from './subStores/action'
import createAction from './subStores/action'
import type {ActionExecution} from './subStores/actionExecution'
import createActionExecution from './subStores/actionExecution'
import type {RuleExecution} from './subStores/ruleExecution'
import createRuleExecution from './subStores/ruleExecution'

export type DispatchedAction = {
  storeType: 'DISPATCHED_ACTION',
  id: number
}

export type Saga = {
  storeType: 'SAGA',
  id: number,
  type: 'ADD_WHEN' | 'ADD_UNTIL',
  rule: Rule,
  sagaExecutions: SagaExecution[]
}

export type SagaExecution = {
  storeType: 'SAGA_EXECUTION',
  id: number,
  status: 'PENDING' | 'RESOLVED' | 'ABORTED',
  saga: Saga,
  rule: Rule,
  sagaYields: SagaYield[]
}

export type SagaYield = {
  storeType: 'SAGA_YIELD',
  id: number,
  sagaExecution: SagaExecution,
  rule: Rule
}

export type RootStore = {
  private: {
    actions: {
      byActionType: {[string] : Action},
      // byRuleTarget: {[string]: Action[]},
      // byRuleOutput: {[string]: Action[]},
      // byActionExecId: {[number]: Action}
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
      byRuleExecId: {[number]: ActionExecution[]},
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
  toJS: (store?:any) => RootStore
}

const rootStore:RootStore = observable(({
  private: {
    actions: {
      byActionType: {},
      // byRuleTarget: {},
      // byRuleOutput: {},
      // byActionExecId: {}
    },
    rules: {
      byRuleId: {},
      byRuleTarget: {},
      byRuleOutput: {},
      bySagaId: {},
      bySagaExecId: {},
      bySagaYieldId: {}
    },
    sagas: {
      bySagaId: {},
      byRuleId: {}
    },
    actionExecutions: {
      byActionExecId: {},
      byActionType: {},
      byRuleExecId: {},
    },
    dispatchedActions: {
      byDispatchedActionId: {}
    },
    ruleExecutions: {
      byRuleExecId: {},
      byRuleId: {},
      byActionExecId: {},
    },
    sagaExecutions: {
      bySagaExecId: {},
      bySagaId: {},
      bySagaYieldId: {}
    },
    sagaYields: {
      bySagaYieldId: {},
      bySagaExecId: {},
      byActionExecId: {}
    }
  },
  toJS(store){
    if(store) return toJS(store)
    return toJS(this)
  }
}:RootStore))



events.addListener(e => {
  switch(e.type){
    case 'REGISTER_RULE': {
      createRule(e, rootStore)
      if(e.rule.target === '*'){

      }
      else if(typeof e.rule.target === 'string'){
        createAction(e, rootStore, e.rule.target)
      }
      else if(Array.isArray(e.rule.target)){
        e.rule.target.forEach(type => createAction(e, rootStore, type))
      }
    }
    case 'EXEC_RULE_START': return createRuleExecution(e, rootStore)
    case 'EXEC_ACTION_START': return createActionExecution(e, rootStore)
    // case 'DISPATCH_ACTION': return createDispatchedAction(e)
    // case 'EXEC_SAGA_START': return createSagaStore(e)
    // case 'YIELD_SAGA': return createSagaYieldStore(e)
  }
}, true)