// @flow
import events from './events'
import {observable} from 'mobx'

import type {Rule, Action} from './events'

export type ActionStore = {
  store: {action:Action, rules:Rule[]}[],
  actions: Action[]
}

const actionStore:ActionStore = observable(({
  store: [],

  addAction(action){
    store.push({})
  }

}:ActionStore))

export default actionStore

window.ActionStore = actionStore

let lastAction:Action = {type:'INIT'}
events.addListener(event => {
  if(event[0] === 'action') {
    const action = event[1]
    console.log('action', action.type)
    actionStore.store[action.type] = {action, rules:[]}
    lastAction = action
  }
  if(event[0] === 'deny-rule') {
    const rule = event[1]
    console.log('deny', rule.id, lastAction)
    debugger
    actionStore.store[lastAction.type].rules.push(rule)
  }
  if(event[0] === 'exec-rule') {
    const rule = event[1]
    actionStore.store[lastAction.type].rules.push(rule)
  }
}, true)