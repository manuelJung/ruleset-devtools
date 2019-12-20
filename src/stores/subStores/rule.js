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
  getStatus: (eventId?:number) => 'ACTIVE' | 'REMOVED' | 'PENDING', // | 'CANCELED'
  // sagas: Saga[],
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
  rootStore:t.RootStore
) {
  if(rootStore.private.rules.byRuleId[event.rule.id]) return
  const store:Rule = observable(({
    storeType: 'RULE',
    id: event.rule.id,
    position: event.rule.position || 'AFTER',
    status: 'PENDING',
    weight: event.rule.weight || 0,

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
        target.forEach(type => result.push(actionsByType[type]))
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
        output.forEach(type => result.push(actionsByType[type]))
        return result
      }
      return []
    },
    get sagas(){
      return []
    },

    getStatus(eventId){
      if(typeof eventId !== 'undefined'){
        for(let row of store.__time.status){
          if(eventId >= row.eventId) return row.data
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
  })
  events.addListenerByEventName('REMOVE_RULE','ruleId',store.id, (e,eventId) => {
    if(e.type !== 'REMOVE_RULE') return
    store.status = 'REMOVED'
  })
  events.addListenerByEventName('EXEC_SAGA_START','ruleId',store.id, (e,eventId) => {
    if(e.type !== 'EXEC_SAGA_START') return
    store.status = 'PENDING'
  })
  // events.addListenerByEventName('EXEC_SAGA_END','ruleId',store.id, e => {
  //   if(e.type !== 'EXEC_SAGA_END') return
  //   switch(e.sagaType){
  //     case 'ADD_WHEN': switch(e.result) {
  //       case 'ADD_RULE_BEFORE': return (store.status='ACTIVE')
  //       case 'ADD_RULE': return (store.status='ACTIVE')
  //       case 'ABORT': return
  //       case 'CACEL': return
  //       case 'REAPPLY_WHEN': return
  //     }
  //     case 'ADD_UNTIL': {

  //     }
  //   }
  //   // if(e.sagaType === 'ADD_WHEN'){
  //   //   if(e.result === 'ADD_RULE_BEFORE'){
  //   //     store.status = 'ACTIVE'
  //   //   }
  //   //   if(e.result === 'ADD_RULE'){
  //   //     let listeners = []
  //   //     // const innerListener = events.addListener(ex => {
  //   //     //   if(ex.type === 'EXEC_ACTION_END' && ex === e.)
  //   //     // })
  //   //     store.status = 'ACTIVE'
  //   //   }
  //   //   if(e.result === 'ABORT' || e.result === 'CANCELED'){
  //   //     store.status = 'REMOVED'
  //   //     events.removeListener(listener)
  //   //   }
  //   // }
  //   // if(e.sagaType === 'ADD_UNTIL'){
      
  //   // }
  // })

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