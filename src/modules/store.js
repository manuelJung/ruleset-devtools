import {observable} from 'mobx'
import events from './events'

const dataStore = observable({
  ruleExecutions: {
    byId: {},
    byRuleId: {} // []
  },
  actionExecutions: {
    byId: {},
    byRuleId: {} // [],
    byExecutionId: {} // []
  },
  rulesets: {
    byId: {}
  }
})

events.on('ACTION', action => {
  const store = createActionExecution(action)
  const dict = dataStore.actionExecutions
  const {id, ruleId, executionId} = action.meta
  dict.byId[id] = store
  if(ruleId) {
    if(!dict.byExecutionId[executionId]) dict.byExecutionId[executionId] = []
    dict.byExecutionId[executionId].push(store)
    if(!dict.byRuleId[ruleId]) dict.byRuleId[ruleId] = []
    dict.byRuleId[ruleId] = store
  }
})

events.on('EXEC_RULE', action => {
  const store = createRuleExecution(action)
  const dict = dataStore.actionExecutions
  const {id, ruleId} = action.meta
  dict.byId[id] = store
  if(!dict.byRuleId[executionId]) dict.byRuleId[executionId] = []
  dict.byRuleId[executionId].push(store)
})

events.on('ADD_RULE', action => {
  const store = createRuleset(action)
  const dict = dataStore.rulesets
  const {id, ruleId} = action.meta
  dict.byId[id] = store
})

/*{
  type: 'EXEC_RULE',
  meta: {
    id: id++,
    timestamp: Date.now(),
    ruleId: rule.id
  },
  payload: 'CONDITION_MATCH'
}*/
const createRuleExecution = action => {
  const store = observable({
    id: action.meta.id, 
    ruleId: action.meta.ruleId, 
    timestamp: action.meta.timestamp, 
    finished: false,
    status: action.payload,
    get actions(){
      const dict = dataStore.actionExecutions.byExecutionId
      if(!dict) return []
      return Object.keys(dict).map(key => dict[key])
    }
  })
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
const createActionExecution = action => {
  const store = observable({
    id: action.meta.id, 
    timestamp: action.meta.timestamp,
    action: action.payload,
    get ruleExecution(){
      const {executionId} = action.meta
      return dataStore.ruleExecutions.byId[executionId] || null
    }
  })
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
createRuleset = action => {
  const store = observable({
    rule: action.payload,
    active: action.payload.addWhen ? false : true,
    pendingWhen: action.payload.addWhen ? true : false,
    pendingUntil: false,
    parentRule: null,
    subRules: [],
    get ruleExecutions(){
      const dict = dataStore.ruleExecutions.byRuleId
      if(!dict) return []
      return Object.keys(dict).map(key => dict[key])
    }
  })
  events.on('REMOVE_RULE', action => {
    if(action.payload === store.rule.id){
      store.active = false
    }
  })
  return store
}
