// @flow
import {observable, toJS} from 'mobx'
import events from './events'
import createRule from './subStores/rule'
import createAction from './subStores/action'
import createActionExecution from './subStores/actionExecution'
import createRuleExecution from './subStores/ruleExecution'
import createDispatchedAction from './subStores/dispatchedAction'
import * as t from './types'

export type Saga = {
  storeType: 'SAGA',
  id: number,
  type: 'ADD_WHEN' | 'ADD_UNTIL',
  rule: t.Rule,
  sagaExecutions: SagaExecution[]
}

export type SagaExecution = {
  storeType: 'SAGA_EXECUTION',
  id: number,
  status: 'PENDING' | 'RESOLVED' | 'ABORTED',
  saga: Saga,
  rule: t.Rule,
  sagaYields: SagaYield[]
}

export type SagaYield = {
  storeType: 'SAGA_YIELD',
  id: number,
  sagaExecution: SagaExecution,
  rule: t.Rule
}

export type RootStore = {
  private: {
    actions: {
      byActionType: {[string] : t.Action},
      // byRuleTarget: {[string]: Action[]},
      // byRuleOutput: {[string]: Action[]},
      // byActionExecId: {[number]: Action}
    },
    rules: {
      byRuleId: {[string] : t.Rule},
      byRuleTarget: {[string]: t.Rule[]},
      byRuleOutput: {[string]: t.Rule[]},
      bySagaId: {[number]: t.Rule},
      bySagaExecId: {[number]: t.Rule},
      bySagaYieldId: {[number]: t.Rule}
    },
    sagas: {
      bySagaId: {[number]:Saga},
      byRuleId: {[string]: Saga[]}
    },
    actionExecutions: {
      byActionExecId: {[number]: t.ActionExecution},
      byActionType: {[string]: t.ActionExecution[]},
      byRuleExecId: {[number]: t.ActionExecution[]},
    },
    dispatchedActions: {
      ordered: t.DispatchedAction[],
      byActionExecId: {[number]: t.DispatchedAction},
    },
    ruleExecutions: {
      byRuleExecId: {[number]: t.RuleExecution},
      byRuleId: {[string]: t.RuleExecution[]},
      byActionExecId: {[number]: t.RuleExecution[]},
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
  dispatchedActions: t.DispatchedAction[],
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
      ordered: [],
      byActionExecId: {}
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
  get dispatchedActions() {
    return rootStore.private.dispatchedActions.ordered
  },
  toJS(store){
    if(store) return toJS(store)
    return toJS(this)
  }
}:RootStore))

window.rootStore = rootStore

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
    case 'DISPATCH_ACTION': return createDispatchedAction(e, rootStore)
    // case 'EXEC_SAGA_START': return createSagaStore(e)
    // case 'YIELD_SAGA': return createSagaYieldStore(e)
  }
}, true)

export default rootStore