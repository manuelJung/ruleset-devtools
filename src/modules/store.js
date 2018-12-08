// @flow
import {observable, toJS} from 'mobx'
import events from './events'

import type {ActionExecution, RuleExecution, Ruleset} from './entities'

type DataStore = {
  _ruleExecutions: {
    byId: {[executionId:number]: RuleExecution},
    byRuleId: {[ruleId:string]: RuleExecution[]},
    byActionExecId: {[actionId:number]: RuleExecution[]}
  },
  _actionExecutions: {
    allIds: number[],
    byId: {[actionId:number]: ActionExecution},
    byRuleId: {[ruleId:string]: ActionExecution[]},
    byExecutionId: {[executionId:number]: ActionExecution[]}
  },
  _rulesets: {
    byId: {[ruleId:string]: Ruleset},
  },
  actionExecutions: ActionExecution[],
  toJS: (store?:any) => DataStore
}

const dataStore:DataStore = observable(({
  _ruleExecutions: {
    byId: {},
    byRuleId: {}, // []
    byActionExecId: {} // []
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
  toJS(store){
    if(store) return toJS(store)
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
    id: event.id, 
    ruleId: event.ruleId, 
    timestamp: event.timestamp, 
    finished: false,
    status: event.result,
    get rule(){
      const {ruleId} = event
      return dataStore._rulesets.byId[ruleId].rule
    },
    get actionExecutions(){
      const dict = dataStore._actionExecutions.byExecutionId[this.id]
      if(!dict) return []
      return dict
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
    id: event.id,
    timestamp: event.timestamp,
    action: event.action,
    get assignedRuleExecutions(){
      return dataStore._ruleExecutions.byActionExecId[this.id] || []
    },
    get ruleExecution(){
      const {ruleExecId} = event
      if(!ruleExecId) return null
      return dataStore._ruleExecutions.byId[ruleExecId]
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
    id: event.rule.id,
    rule: event.rule,
    active: false, //event.payload.addWhen ? false : true,
    pendingWhen: false,// event.payload.addWhen ? true : false,
    pendingUntil: false,
    subRules: [],
    get parentRuleset(){
      const ruleId = event.rule.id
      const dict = dataStore._rulesets.byId
      return dict[ruleId] || null
    },
    get ruleExecutions(){
      const dict = dataStore._ruleExecutions.byRuleId
      if(!dict) return []
      return ((Object.values(dict):any):RuleExecution[])
    }
  }:Ruleset))
  // events.addListener(event => {
  //   if(event.type !== 'REMOVE_RULE') return
  //   if(event.payload === store.rule.id){
  //     store.active = false
  //   }
  // })
  return store
}


events.addListener(event => {
  if(event.type === 'EXEC_ACTION'){
    const store = createActionExecution(event)
    const dict = dataStore._actionExecutions
    const {id, ruleExecId, ruleId} = event
    dict.byId[id] = store
    dict.allIds.push(id)
    if(ruleExecId && ruleId) {
      if(!dict.byExecutionId[ruleExecId]) dict.byExecutionId[ruleExecId] = []
      dict.byExecutionId[ruleExecId].push(store)
      if(!dict.byRuleId[ruleId]) dict.byRuleId[ruleId] = []
      dict.byRuleId[ruleId].push(store)
    }
  }
  if(event.type === 'EXEC_RULE'){
    const store = createRuleExecution(event)
    const dict = dataStore._ruleExecutions
    const {id, ruleId, actionExecId} = event
    // const rule = dataStore._rulesets.byId[ruleId].rule
    // let actionTypes = rule.target === '*' ? ['global']
    //   : Array.isArray(rule.target) ? rule.target : [rule.target]
    dict.byId[id] = store
    if(!dict.byActionExecId[actionExecId]) dict.byActionExecId[actionExecId] = []
    dict.byActionExecId[actionExecId].push(store)
    if(!dict.byRuleId[ruleId]) dict.byRuleId[ruleId] = []
    dict.byRuleId[ruleId].push(store)

  }
  if(event.type === 'ADD_RULE'){
    const store = createRuleset(event)
    const dict = dataStore._rulesets
    const {id} = event.rule
    dict.byId[id] = store
  }
}, true)