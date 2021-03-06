// @flow
import {observable, toJS} from 'mobx'
import events from '../events'
import * as t from '../types'
import {push} from 'utils/helpers'

export type Rule = {
  storeType: 'RULE',
  id: string,
  position: 'AFTER' | 'BEFORE' | 'INSTEAD',
  status: 'ACTIVE' | 'REMOVED' | 'PENDING',
  weight: number,
  targetActions: t.Action[],
  outputActions: t.Action[],
  ruleExecutions: t.RuleExecution[],
  sagaExecutions: t.SagaExecution[],
  sagaYields: t.SagaYield[],
  data: $PropertyType<t.RegisterRuleEvent, 'rule'>,
  getStatus: (eventId?:number) => 'ACTIVE' | 'REMOVED' | 'PENDING', // | 'CANCELED'
  toJs: () => Rule,
  __time: {
    status: {
      eventId: number,
      data: 'ACTIVE' | 'REMOVED' | 'PENDING', // | 'CANCELED'
    }[]
  }
}

export default function createRule (
  event:t.RegisterRuleEvent, 
  rootStore:t.RootStore,
  eventId: number
) {
  if(rootStore.private.rules.byRuleId[event.rule.id]) return
  const store:Rule = observable(({
    storeType: 'RULE',
    id: event.rule.id,
    position: event.rule.position || 'AFTER',
    status: 'PENDING',
    weight: event.rule.weight || 0,
    data: event.rule,

    get targetActions(){
      const {target} = event.rule
      if(target === '*'){
        return []
      }
      if(typeof target === 'string'){
        return [rootStore.private.actions.byActionType[target]] || []
      }
      if(Array.isArray(target)){
        let result = []
        let actionsByType = rootStore.private.actions.byActionType
        target.forEach(type => {
          if(!actionsByType[type]) {
            // alert('no type found')
            // console.log(target, type)
            return
          }
          result.push(actionsByType[type])
        })
        return result
      }
      return []
    },
    get outputActions(){
      const {output} = event.rule
      if(!output) return []
      if(output === '*'){
        return []
      }
      if(typeof output === 'string'){
        return [rootStore.private.actions.byActionType[output]] || []
      }
      if(Array.isArray(output)){
        let result = []
        let actionsByType = rootStore.private.actions.byActionType
        output.forEach(type => {
          if(!actionsByType[type]) return
          result.push(actionsByType[type])
        })
        return result
      }
      return []
    },

    get ruleExecutions(){
      return rootStore.private.ruleExecutions.byRuleId[event.rule.id] || []
    },

    get sagaExecutions(){
      return rootStore.private.sagaExecutions.byRuleId[event.rule.id] || []
    },

    get sagaYields(){
      return rootStore.private.sagaYields.byRuleId[event.rule.id] || []
    },

    getStatus(eventId){
      if(typeof eventId !== 'undefined'){
        let prev = store.__time.status[0]
        for(let i=0;i<store.__time.status.length;i++){
          const row = store.__time.status[i]
          if(eventId < row.eventId) return prev.data
          else (prev = row)
        }
      }
      return store.status
    },
    
    toJs(){
      return toJS(this)
    },

    __time: {
      status: []
    }
  }:Rule))

  // listeners
  events.addListenerByEventName('ADD_RULE','ruleId',store.id, (e,eventId) => {
    if(e.type !== 'ADD_RULE') return
    store.status = 'ACTIVE'
    store.__time.status.push({eventId, data:'ACTIVE'})
  })
  events.addListenerByEventName('REMOVE_RULE','ruleId',store.id, (e,eventId) => {
    if(e.type !== 'REMOVE_RULE') return
    store.status = 'REMOVED'
    store.__time.status.push({eventId, data:'REMOVED'})
  })
  events.addListenerByEventName('EXEC_SAGA_START','ruleId',store.id, (e,eventId) => {
    if(e.type !== 'EXEC_SAGA_START') return
    if(e.sagaType === 'ADD_WHEN'){
      store.status = 'PENDING'
      store.__time.status.push({eventId, data:'PENDING'})
    }
    if(e.sagaType === 'ADD_UNTIL'){
      store.status = 'ACTIVE'
      store.__time.status.push({eventId, data:'ACTIVE'})
    }
  })
  events.addListenerByEventName('EXEC_SAGA_END','ruleId',store.id, (e,eventId) => {
    if(e.type !== 'EXEC_SAGA_END') return
    const set = status => {
      store.status = status
      // store.__time.status.push({eventId, data:status})
    }
    switch(e.sagaType){
      case 'ADD_WHEN': switch(e.result) {
        case 'ADD_RULE_BEFORE': return (set('ACTIVE'))
        case 'ADD_RULE': return (set('ACTIVE'))
        case 'ABORT': return (set('REMOVED'))
        case 'CANCEL': return (set('REMOVED'))
        default: return
      }
      case 'ADD_UNTIL': switch(e.result) {
        case 'RECREATE_RULE': {
          if(store.data.addWhen) return (set('PENDING'))
        }
        case 'REMOVE_RULE': return (set('REMOVED'))
        default: return
      }
    }
  })

  // attach
  const {target, output} = event.rule
  rootStore.private.rules.byRuleId[store.id] = store
  if(target === '*'){

  }
  else if(typeof target === 'string'){
    push(rootStore.private.rules.byRuleTarget, target, store)
  }
  else if(Array.isArray(target)){
    target.forEach(type => push(rootStore.private.rules.byRuleTarget, type, store))
  }

  if(!output){}
  else if(typeof output === 'string'){
    push(rootStore.private.rules.byRuleOutput, output, store)
  }
  else if(Array.isArray(output)){
    output.forEach(type => push(rootStore.private.rules.byRuleOutput, type, store))
  }
}