// @flow
import {observable, toJS} from 'mobx'
import events from './events'
import {push} from 'utils/helpers'

import type {DispatchedAction, ActionExecution, RuleExecution, Ruleset, SagaStore, SagaYieldStore} from './entities'

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
    byRuleExecId: {[executionId:number]: ActionExecution[]}
  },
  _sagas: {
    byId: {[sagaId:number]: SagaStore},
    byRuleId: {[ruleId:string]: SagaStore[]}
  },
  _sagaYields: {
    bySagaId: {[sagaId:number]: SagaYieldStore[]},
    byActionExecId: {[actionExecId:number]: SagaYieldStore[]}
  },
  _rulesets: {
    byId: {[ruleId:string]: Ruleset},
  },
  _dispatchedActions: {
    all: DispatchedAction[],
    byActionExecId: { [id:number]: DispatchedAction }
  },
  list: 
    ({type: 'action', actionExecId: number}
  | {type: 'rules', removed: string[], added: string[]})[],

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
    byRuleExecId: {} // []
  },
  _sagas: {
    byId: {},
    byRuleId: {}
  },
  _sagaYields: {
    bySagaId: {},
    byActionExecId: {}
  },
  _dispatchedActions: {
    all: [],
    byActionExecId: {}
  },
  _rulesets: {
    byId: {}
  },
  list: [],
  get actionExecutions(){
    return dataStore._dispatchedActions.all.map(o => o.actionExecution)
  },
  toJS(store){
    if(store) return toJS(store)
    return toJS(this)
  }
}:DataStore))

type Item = {type: 'action', actionExecId: number}
| {type: 'add_rule', ruleId: string}
| {type: 'remove_rule', ruleId: string}
const addListItem = (item:Item) => {
  if(item.type === 'action'){
    dataStore.list.push(item)
    return
  }
  let lastItem = dataStore.list[dataStore.list.length-1]
  if(!lastItem || lastItem.type === 'action'){
    dataStore.list.push({type: 'rules', added: [], removed: []})
  }
  lastItem = dataStore.list[dataStore.list.length-1]
  if(item.type === 'add_rule' && lastItem.type === 'rules'){
    lastItem.added.push(item.ruleId)
  }
  else if(item.type === 'remove_rule' && lastItem.type === 'rules'){
    lastItem.removed.push(item.ruleId)
  }
}

export default dataStore

window.dataStore = dataStore


const createRuleExecution = event => {
  const store:RuleExecution = observable(({
    storeType: 'RULE_EXECUTION',
    id: event.ruleExecId,
    timestampStart: event.timestamp, 
    timestampEnd: null,
    finished: false,
    status: 'PENDING',
    get ruleset(){
      const {ruleId} = event
      return dataStore._rulesets.byId[ruleId]
    },
    // get parentAction
    get actionExecutions(){
      const dict = dataStore._actionExecutions.byRuleExecId[event.ruleExecId]
      if(!dict) return []
      return dict
    }
  }:RuleExecution))
  // listeners
  const listener = events.addListener(e => {
    switch(e.type){
      case 'EXEC_RULE_END': {
        if(event.ruleExecId === e.ruleExecId){
          store.finished = true
          store.status = e.result
          store.timestampEnd = e.timestamp
          events.removeListener(listener)
        }
      }
    }
  })
  // attach
  const dict = dataStore._ruleExecutions
  dict.byId[event.ruleExecId] = store
  dict.byRuleId[event.ruleId] = push(dict.byRuleId[event.ruleId], store)
  if(event.actionExecId){
    const id = event.actionExecId
    dict.byActionExecId[id] = push(dict.byActionExecId[id], store)
  } 
}

const createDispatchedAction = event => {
  const store:DispatchedAction = observable({
    storeType: 'DISPATCHED_ACTION',
    actionExecId: event.actionExecId,
    timestamp: event.timestamp,
    action: event.action,
    removed: event.removed,
    isReduxAction: event.isReduxAction,
    get actionExecution(){
      return dataStore._actionExecutions.byId[event.actionExecId]
    }
  })
  // push to list
  addListItem({type: 'action', actionExecId: event.actionExecId})
  // attach
  const dict = dataStore._dispatchedActions
  dict.all.push(store)
  dict.byActionExecId[event.actionExecId] = store
}

const createActionExecution = event => {
  const store:ActionExecution = observable(({
    storeType: 'ACTION_EXECUTION',
    id: event.actionExecId,
    timestampStart: event.timestamp,
    timestampEnd: null,
    action: event.action,
    status: 'PENDING',
    // get removed(){
    //   return dataStore._dispatchedActions.byActionExecId[event.id].removed
    // },
    get assignedRuleExecutions(){
      return dataStore._ruleExecutions.byActionExecId[event.actionExecId] || []
    },
    get assignedSagaYields(){
      return dataStore._sagaYields.byActionExecId[event.actionExecId] || []
    },
    get dispatchedAction(){
      return dataStore._dispatchedActions.byActionExecId[event.actionExecId]
    },
    get relatedActionExecutions(){
      const list = store.assignedRuleExecutions.map(ruleExec => ruleExec.actionExecutions)
      return [].concat(...list)
    },
    get relatedActionExecutionsDict(){
      let dict = {}
      const list = store.relatedActionExecutions
      for(let i=0;i<list.length;i++){dict[list[i].id] = list[i]}
      return dict
    },
    get ruleExecution(){
      const {ruleExecId} = event
      if(!ruleExecId) return null
      return dataStore._ruleExecutions.byId[ruleExecId]
    }
  }:ActionExecution))
  // listeners
  const listener = events.addListener(e => {
    switch(e.type){
      case 'EXEC_ACTION_END': {
        if(event.actionExecId === e.actionExecId){
          store.status = e.result
          store.timestampEnd = e.timestamp
          events.removeListener(listener)
        }
      }
    }
  })
  // attach
  const dict = dataStore._actionExecutions
  dict.byId[event.actionExecId] = store
  dict.allIds.push(event.actionExecId)
  if(event.ruleExecId){
    const id = event.ruleExecId
    dict.byRuleExecId[id] = push(dict.byRuleExecId[id], store)
    const ruleId = dataStore._ruleExecutions.byId[id].ruleset.id
    dict.byRuleId[ruleId] = push(dict.byRuleId[ruleId], store)
  } 
}

const createRuleset = event => {
  const store:Ruleset = observable(({
    storeType: 'RULESET',
    id: event.rule.id,
    rule: event.rule,
    active: false,
    addWhenSaga: null,
    addUntilSaga: null,
    subRules: [],
    get parentRuleset():Ruleset|null{
      const ruleId = event.rule.id
      const dict = dataStore._rulesets.byId
      return dict[ruleId] || null
    },
    get ruleExecutions(){
      const dict = dataStore._ruleExecutions.byRuleId[event.rule.id]
      if(!dict) return []
      return dict
    }
  }:Ruleset))
  // listeners
  const listener = events.addListener(e => {
    switch(e.type){
      case 'REMOVE_RULE': {
        if(e.ruleId === event.rule.id){
          addListItem({type: 'remove_rule', ruleId: event.rule.id})
          store.active = false
          events.removeListener(listener)
        }
      }
    }
  })
  // push to list
  addListItem({type: 'add_rule', ruleId: event.rule.id})
  // attach
  const dict = dataStore._rulesets
  const {id} = event.rule
  dict.byId[id] = store
}

const createSagaStore = event => {
  console.log(event.ruleId)
  const store:SagaStore = observable(({
    storeType: 'SAGA_STORE',
    timestampStart: event.timestamp,
    timestampEnd: null,
    type: event.sagaType,
    status: 'PENDING',
    active: true,
    get yields(){
      const yieldStore = dataStore._sagaYields
      return yieldStore.bySagaId[event.sagaId] || []
    },
    get ruleset(){
      console.log('ruleset', event.ruleId)
      console.log(toJS(dataStore._rulesets.byId))
      return dataStore._rulesets.byId[event.ruleId]
    }
  }:SagaStore))
  // listeners
  const listener = events.addListener(e => {
    switch(e.type){
      case 'EXEC_SAGA_END': {
        if(e.sagaId === event.sagaId){
          store.active = false
          store.status = e.result
          store.timestampEnd = e.timestamp
          events.removeListener(listener)
        }
      }
    }
  })
  // attach
  const dict = dataStore._sagas
  dict.byId[event.sagaId] = store
  dict.byRuleId[event.ruleId] = push(dict.byRuleId[event.ruleId], store)
}

const createSagaYieldStore = event => {
  const store:SagaYieldStore = observable(({
    storeType: 'SAGA_YIELD_STORE',
    timestamp: event.timestamp,
    action: event.action,
    result: event.result,
    get saga(){
      return dataStore._sagas.byId[event.sagaId]
    }
  }:SagaYieldStore))
  // attach
  const dict = dataStore._sagaYields
  dict.bySagaId[event.sagaId] = push(dict.bySagaId[event.sagaId], store)
  dict.byActionExecId[event.actionExecId] = push(dict.byActionExecId[event.actionExecId], store)
}


events.addListener(e => {
  switch(e.type){
    case 'REGISTER_RULE': return createRuleset(e)
    case 'EXEC_RULE_START': return createRuleExecution(e)
    case 'EXEC_ACTION_START': return createActionExecution(e)
    case 'DISPATCH_ACTION': return createDispatchedAction(e)
    case 'EXEC_SAGA_START': return createSagaStore(e)
    case 'YIELD_SAGA': return createSagaYieldStore(e)
  }
}, true)