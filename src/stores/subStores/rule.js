// @flow
import {observable, toJS} from 'mobx'
import events from '../events'
import type {RegisterRuleEvent} from '../events'
import type {RootStore} from '../root'
import type {Action} from './action'

export type Rule = {
  storeType: 'RULE',
  id: string,
  targetActions: Action[],
  outputActions: Action[],
  sagas: Saga[],
  toJs: () => Rule
}

export default function createRule (
  event:RegisterRuleEvent, 
  rootStore:RootStore
) {
  const store:Rule = observable(({
    storeType: 'RULE',
    id: event.rule.id,

    get targetActions(){
      return []
    },
    get outputActions(){
      return []
    },
    get sagas(){
      return []
    },
    
    toJs(){
      return toJS(this)
    }
  }:Rule))

  // listeners
  const listener = events.addListener(e => {})

  // attach
  rootStore.private.rules.byRuleId[store.id]
}