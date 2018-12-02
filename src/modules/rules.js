// @flow
import events from './events'
import {observable} from 'mobx'

import type {Rule} from './events'

export type RuleStore = {
  store: {[ruleId:string]: Rule},
  rules: Rule[]
}

const rules:RuleStore = observable(({
  store: {},
  get rules(){
    return Object.keys(this.store).map(id => this.store[id])
  }
}:RuleStore))

export default rules

window.RuleStore = rules

events.addListener(event => {
  if(event[0] === 'add-rule') {
    const rule = event[1]
    rules.store[rule.id] = rule
  }
  if(event[0] === 'remove-rule') {
    const rule = event[1]
    delete rules.store[rule.id]
  }
}, true)