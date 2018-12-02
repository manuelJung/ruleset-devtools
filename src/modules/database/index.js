// @flow
import {observable, action} from 'mobx'
import ruleExecutionReducer from './ruleExecutionReducer'

import type {RuleExecution, ActionExecution, Ruleset, Action} from './entities'
import type {State as REState} from './ruleExecutionReducer'

export type DB = {
  ruleExecutions: REState,
  actionExecutions: {[id:string]: ActionExecution},
  rulesets: {[id:string]: Ruleset},
}

type Store = {
  db: DB,
  dispatch: (action:Action) => void
}

const store:Store = observable(({
  db: {
    ruleExecutions: ruleExecutionReducer(undefined, {type:'INIT'}),
    actionExecutions: {},
    rulesets: {}
  },
  dispatch(_action){
    action(() => {
      this.db.ruleExecutions = ruleExecutionReducer(this.db.ruleExecution, _action, this.db)
      this.db.actionExecutions = {}
      this.db.rulesets = {}
    })()
  },
}:Store))

export default store