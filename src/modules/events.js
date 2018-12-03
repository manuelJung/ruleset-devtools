// @flow

import type {Event} from './entities'

type CB = (event:Event) => mixed

let buffer = []
let listeners = []

const events = {
  push(...items:Event[]){
    items.forEach(e => listeners.forEach(l => l(e)))
    return buffer.push(...items)
  },
  addListener(cb:CB, applyPastEvents?:boolean){
    listeners.push(cb)
    applyPastEvents && buffer.forEach(e => cb(e))
  },
  removeListener(cb:CB){
    listeners = listeners.filter(l => l !== cb)
  }
}

export default events



// add default events

const pongRule = {
  id: 'PING_PONG',
  target: 'PING',
  position: 'INSERT_AFTER',
  consequence: '() => ({type:"PONG"})'
}

const searchRule = {
  id: 'FETCH',
  target: 'FETCH_REQUEST',
  position: 'INSERT_AFTER',
  consequence: `() => fetch().then(r => ({type:'FETCH_SUCCESS', payload:r}))`
}

const denyRule = {
  id: 'DENY',
  target: '*',
  position: 'INSERT_AFTER',
  condition: `action => action.type === 'FETCH_SUCCESS'`,
  consequence: `() => console.log('TEST')`
}

events.push(
  {
    type: 'ADD_RULE',
    meta: {id:'PING_PONG', timestamp:0},
    payload: pongRule
  },{
    type: 'ADD_RULE',
    meta: {id:'SEARCH', timestamp:0},
    payload: searchRule
  },{
    type: 'ADD_RULE',
    meta: {id:'DENY', timestamp:0},
    payload: denyRule
  },{
    type: 'ACTION',
    meta: { id: '1', executionId: null, ruleId:null, timestamp: 0 },
    payload: {type: 'FETCH_REQUEST'}
  },{
    type: 'EXEC_RULE',
    meta: { id: '2', timestamp: 0, ruleId: 'DENY', actionId:'1'},
    payload: 'NO_CONDITION_MATCH'
  },{
    type: 'EXEC_RULE',
    meta: { id: '3', timestamp: 0, ruleId: 'SEARCH',actionId:'1'},
    payload: 'CONDITION_MATCH'
  },{
    type: 'ACTION',
    meta: { id: '4', executionId: null, ruleId:null, timestamp: 0 },
    payload: {type: 'PING'}
  },{
    type: 'EXEC_RULE',
    meta: { id: '5', timestamp: 0, ruleId: 'DENY',actionId:'4'},
    payload: 'NO_CONDITION_MATCH'
  },{
    type: 'EXEC_RULE',
    meta: { id: '6', timestamp: 0, ruleId: 'PING_PONG', actionId:'4'},
    payload: 'CONDITION_MATCH'
  },{
    type: 'ACTION',
    meta: { id: '7', executionId: '6', ruleId:'PING_PONG', timestamp: 0 },
    payload: {type: 'PONG'}
  },{
    type: 'EXEC_RULE',
    meta: { id: '8', timestamp: 0, ruleId: 'DENY', actionId:'7'},
    payload: 'NO_CONDITION_MATCH'
  },{
    type: 'ACTION',
    meta: { id: '9', executionId: '3', ruleId:'SEARCH', timestamp: 0 },
    payload: {type: 'FETCH_SUCCESS'}
  },{
    type: 'EXEC_RULE',
    meta: { id: '10', timestamp: 0, ruleId: 'DENY', actionId:'9'},
    payload: 'CONDITION_MATCH'
  }
)