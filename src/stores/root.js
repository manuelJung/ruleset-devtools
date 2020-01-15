// @flow
import {observable, toJS} from 'mobx'
import events from './events'
import createRule from './subStores/rule'
import createAction from './subStores/action'
import createActionExecution from './subStores/actionExecution'
import createRuleExecution from './subStores/ruleExecution'
import createDispatchedAction from './subStores/dispatchedAction'
import createSagaExecution from './subStores/sagaExecution'
import createSagaYield from './subStores/sagaYield'
import * as t from './types'

export type Saga = {
  storeType: 'SAGA',
  id: number,
  type: 'ADD_WHEN' | 'ADD_UNTIL',
  rule: t.Rule,
  sagaExecutions: t.SagaExecution[]
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
      bySagaExecId: {[number]: t.SagaExecution},
      byRuleId: {[string]: t.SagaExecution[]},
      // bySagaId: {[number]: t.SagaExecution[]},
      // bySagaYieldId: {[number]: t.SagaExecution}
    },
    sagaYields: {
      bySagaExecId: {[number]: t.SagaYield[]},
      byActionExecId: {[number]: t.SagaYield[]},
      byRuleId: {[string]: t.SagaYield[]},
    }
  },
  dispatchedActions: t.DispatchedAction[],
  rules: t.Rule[],
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
      byRuleId: {},
      // bySagaId: {},
      // bySagaYieldId: {}
    },
    sagaYields: {
      bySagaExecId: {},
      byActionExecId: {},
      byRuleId: {}
    }
  },
  get dispatchedActions() {
    return rootStore.private.dispatchedActions.ordered
  },
  get rules() {
    return Object.keys(rootStore.private.rules.byRuleId).map(key => rootStore.private.rules.byRuleId[key])
  },
  toJS(store){
    if(store) return toJS(store)
    return toJS(rootStore)
  }
}:RootStore))

window.rootStore = rootStore

events.addListener((e,eventId) => {
  switch(e.type){
    case 'REGISTER_RULE': {
      createRule(e, rootStore, eventId)
      createAction(e, rootStore)
      return
    }
    case 'EXEC_RULE_START': return createRuleExecution(e, rootStore, eventId)
    case 'EXEC_ACTION_START': {
      createAction(e, rootStore)
      createActionExecution(e, rootStore, eventId)
      return
    }
    case 'DISPATCH_ACTION': return createDispatchedAction(e, rootStore, eventId)
    case 'EXEC_SAGA_START': return createSagaExecution(e, rootStore, eventId)
    case 'YIELD_SAGA': return createSagaYield(e, rootStore, eventId)
  }
}, true)

export default rootStore