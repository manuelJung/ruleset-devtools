// @flow

export type Rule = {
  id?: string
}
export type Action = {type:string}

type AddRuleEvent = ['add-rule', Rule, {timestamp:mixed}]
type DenyRuleEvent = ['deny-rule', Rule, {timestamp:mixed}]
type ExecRuleEvent = ['exec-rule', Rule, {timestamp:mixed}]
type RemoveRuleEvent = ['remove-rule', Rule, {timestamp:mixed}]
type ActionEvent = ['action', Action, {timestamp:mixed, ruleId?:string}]

export type Event = AddRuleEvent | DenyRuleEvent | ExecRuleEvent | RemoveRuleEvent | ActionEvent
export type CB = (event:Event) => mixed

let buffer = []
let listeners = []

const events = {
  push(...items:Event[]){
    items.forEach(e => listeners.forEach(l => l(e)))
    return buffer.push(...items)
  },
  addListener(cb:CB, applyPastEvents:boolean){
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
  consequence: '() => ({type:"PONG"})'
}

const searchRule = {
  id: 'FETCH',
  target: 'FETCH_REQUEST',
  consequence: `() => fetch().then(r => ({type:'FETCH_SUCCESS', payload:r}))`
}

const denyRule = {
  id: 'DENY',
  target: '*',
  condition: `action => action.type === 'FETCH_SUCCESS'`,
  consequence: `() => console.log('TEST')`
}

events.push(
  ['add-rule', pongRule, {timestamp:null, parentId: null}],
  ['add-rule', searchRule, {timestamp:null, parentId: null}],
  ['add-rule', denyRule, {timestamp:null, parentId: null}],
  ['action', { type: 'FETCH_REQUEST' }, {timestamp:null, id: 1}],
  ['deny-rule', denyRule, {timestamp:null}],
  ['exec-rule', searchRule, {timestamp:null, id: 1}],
  ['action', { type: 'PING' }, {timestamp:null, id: 2}],
  ['deny-rule', denyRule, {timestamp:null}],
  ['exec-rule', pongRule, {timestamp:null, id: 2}],
  ['action', { type: 'PONG' }, {timestamp:null, id: 3, execId: 2}],
  ['deny-rule', denyRule, {timestamp:null}],
  ['action', { type: 'FETCH_SUCCESS' }, {timestamp:null, id:4, execId:1}],
  ['exec-rule', denyRule, {timestamp:null, id: 3}],
  ['remove-rule', pongRule, {timestamp:null}],
  ['action', { type: 'PING' }, {timestamp:null, id:5}],
  ['deny-rule', denyRule, {timestamp:null}],
  ['action', {type:'SOME_ACTION'}, {timestamp:null, id:6}],
)