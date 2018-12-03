// @flow
import {observable, toJS} from 'mobx'
import events from './events'

import type {ActionExecution, RuleExecution, Ruleset} from './entities'

type DataStore = {
  _ruleExecutions: {
    byId: {[executionId:string]: RuleExecution},
    byRuleId: {[ruleId:string]: RuleExecution[]},
    byActionId: {[actionId:string]: RuleExecution[]}
  },
  _actionExecutions: {
    allIds: string[],
    byId: {[actionId:string]: ActionExecution},
    byRuleId: {[ruleId:string]: ActionExecution[]},
    byExecutionId: {[executionId:string]: ActionExecution[]}
  },
  _rulesets: {
    byId: {[ruleId:string]: Ruleset},
  },
  actionExecutions: ActionExecution[],
  toJS: () => DataStore
}

const dataStore:DataStore = observable(({
  _ruleExecutions: {
    byId: {},
    byRuleId: {}, // []
    byActionId: {} // []
  },
  _actionExecutions: {
    byId: {},
    allIds: [],
    byRuleId: {}, // [],
    byExecutionId: {} // []
  },
  _rulesets: {
    byId: {}
  },
  get actionExecutions(){
    return this._actionExecutions.allIds.map(id => this._actionExecutions.byId[id])
  },
  toJS(){
    return toJS(this)
  }
}:DataStore))

export default dataStore

window.dataStore = dataStore



/*{
  type: 'EXEC_RULE',
  meta: {
    id: id++,
    timestamp: Date.now(),
    ruleId: rule.id
  },
  payload: 'CONDITION_MATCH'
}*/
const createRuleExecution = event => {
  const store:RuleExecution = observable(({
    storeType: 'RULE_EXECUTION',
    id: event.meta.id, 
    ruleId: event.meta.ruleId, 
    timestamp: event.meta.timestamp, 
    finished: false,
    status: event.payload,
    get rule(){
      const {ruleId} = event.meta
      return dataStore._rulesets.byId[ruleId].rule
    },
    get actionExecutions(){
      const dict = dataStore._actionExecutions.byExecutionId
      if(!dict) return []
      return ((Object.values(dict):any):ActionExecution[])
    }
  }:RuleExecution))
  return store
}

/*{
  type: 'ACTION',
  meta: {
    id,
    executionId,
    timestamp: Date.now(),
    ruleId: rule ? rule.id : null,
  },
  payload: action
} */
const createActionExecution = event => {
  const store:ActionExecution = observable(({
    storeType: 'ACTION_EXECUTION',
    id: event.meta.id,
    timestamp: event.meta.timestamp,
    action: event.payload,
    get assignedRuleExecutions(){
      return dataStore._ruleExecutions.byActionId[this.id]
    },
    get ruleExecution(){
      const {executionId} = event.meta
      if(!executionId) return null
      return dataStore._ruleExecutions.byId[executionId]
    }
  }:ActionExecution))
  return store
}

/*{
  type: 'ADD_RULE',
  meta: {
    id: id++,
    timestamp: Date.now(),
  },
  payload: serializeRule(rule)
} */
const createRuleset = event => {
  const store:Ruleset = observable(({
    storeType: 'RULESET',
    id: event.meta.id,
    rule: event.payload,
    active: event.payload.addWhen ? false : true,
    pendingWhen: event.payload.addWhen ? true : false,
    pendingUntil: false,
    parentRule: null,
    subRules: [],
    get ruleExecutions(){
      const dict = dataStore._ruleExecutions.byRuleId
      if(!dict) return []
      return ((Object.values(dict):any):RuleExecution[])
    }
  }:Ruleset))
  events.addListener(event => {
    if(event.type !== 'REMOVE_RULE') return
    if(event.payload === store.rule.id){
      store.active = false
    }
  })
  return store
}


events.addListener(event => {
  if(event.type === 'ACTION'){
    const store = createActionExecution(event)
    const dict = dataStore._actionExecutions
    const {id, ruleId, executionId} = event.meta
    dict.byId[id] = store
    dict.allIds.push(id)
    if(ruleId && executionId) {
      if(!dict.byExecutionId[executionId]) dict.byExecutionId[executionId] = []
      dict.byExecutionId[executionId].push(store)
      if(!dict.byRuleId[ruleId]) dict.byRuleId[ruleId] = []
      dict.byRuleId[ruleId].push(store)
    }
  }
  if(event.type === 'EXEC_RULE'){
    const store = createRuleExecution(event)
    const dict = dataStore._ruleExecutions
    const {id, ruleId, actionId} = event.meta
    const rule = dataStore._rulesets.byId[ruleId].rule
    let actionTypes = rule.target === '*' ? ['global']
      : Array.isArray(rule.target) ? rule.target : [rule.target]
    dict.byId[id] = store
    if(!dict.byActionId[actionId]) dict.byActionId[actionId] = []
    dict.byActionId[actionId].push(store)
    if(!dict.byRuleId[ruleId]) dict.byRuleId[ruleId] = []
    dict.byRuleId[ruleId].push(store)

  }
  if(event.type === 'ADD_RULE'){
    const store = createRuleset(event)
    const dict = dataStore._rulesets
    const {id} = event.meta
    dict.byId[id] = store
  }
}, true)