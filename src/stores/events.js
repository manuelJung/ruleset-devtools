// @flow
import EventList from './eventlist'
import {runInAction} from 'mobx'

export type Action = { 
  type: string,
  meta?: { skipRule?: '*' | string | string[], }
}
export type GetState = () => {}
export type Dispatch = (action:Action) => Action
export type ReduxStore = {
  getState: GetState,
  dispatch: Dispatch
}

export type Position = 'INSERT_BEFORE' | 'INSERT_INSTEAD' | 'INSERT_AFTER'

export type LogicAdd = 'ADD_RULE' | 'ABORT' | 'REAPPLY_WHEN' | 'ADD_RULE_BEFORE'

export type LogicRemove = 'RECREATE_RULE' | 'REMOVE_RULE' | 'REAPPLY_REMOVE' | 'ABORT'

export type LogicConcurrency = 'DEFAULT' | 'FIRST' | 'LAST' | 'DEBOUNCE' | 'THROTTLE' | 'ONCE'

export type AddRule = (rule:Rule) => Rule | false

export type RemoveRule = (rule:Rule) => Rule | false

export type Saga<Logic> = (
  condition: (cb?:(action:Action) => mixed) => Promise<void>,
  getState: GetState
) => Promise<Logic>
type Rule = {
  id: string,
  target: '*' | string | string[],
  output?: '*' | string | string[],
  position?: Position,
  zIndex?: number,
  meta?: {
    throttle?: number,
    debounce?: number
  },
  concurrency?: LogicConcurrency,
  condition?: (action:Action, getState:GetState) => boolean,
  consequence: (store:ReduxStore, action:Action, {addRule:AddRule,removeRule:RemoveRule}) => Action | Promise<Action> | Promise<void> | void | (getState:GetState) => mixed,
  addOnce?: boolean,
  addWhen?: Saga<LogicAdd>,
  addUntil?: Saga<LogicRemove>,
}

export type RegisterRuleEvent = {
  type: 'REGISTER_RULE',
  timestamp: number,
  rule: Rule,
  parentRuleId: string | null
}

export type AddRuleEvent = {
  type: 'ADD_RULE',
  timestamp: number,
  ruleId: string,
  parentRuleId: string | null
}

export type RemoveRuleEvent = {
  type: 'REMOVE_RULE',
  timestamp: number,
  ruleId: string,
  removedByParent: boolean
}

export type ExecRuleStartEvent = {
  type: 'EXEC_RULE_START',
  timestamp: number,
  ruleExecId: number,
  ruleId: string,
  actionExecId: number | null,
  concurrencyFilter: string
}

type ExecRuleEventResult = 'RESOLVED' | 'CONDITION_NOT_MATCH' | 'SKIP' | 'CONCURRENCY_REJECTION'
export type ExecRuleEndEvent = {
  type: 'EXEC_RULE_END',
  timestamp: number,
  ruleExecId: number,
  ruleId: string,
  actionExecId: number | null,
  concurrencyFilter: string,
  result: ExecRuleEventResult
}

export type ExecActionStartEvent = {
  type: 'EXEC_ACTION_START',
  timestamp: number,
  actionExecId: number,
  ruleExecId: number | null,
  action: Action
}

export type ExecActionEndEvent = {
  type: 'EXEC_ACTION_END',
  timestamp: number,
  actionExecId: number,
  ruleExecId: number | null,
  action: Action,
  result: 'DISPATCHED' | 'ABORTED'
}

export type ExecSagaStartEvent = {
  type: 'EXEC_SAGA_START',
  timestamp: number,
  sagaId: number,
  ruleId: string,
  sagaType: 'ADD_WHEN' | 'ADD_UNTIL'
}

type ExecSagaEventResult = 'CANCELED' | LogicAdd | LogicRemove
export type ExecSagaEndEvent = {
  type: 'EXEC_SAGA_END',
  timestamp: number,
  sagaId: number,
  ruleId: string,
  sagaType: 'ADD_WHEN' | 'ADD_UNTIL',
  result: ExecSagaEventResult
}

export type YieldSagaEvent = {
  type: 'YIELD_SAGA',
  timestamp: number,
  sagaId: number,
  ruleId: string,
  sagaType: 'ADD_WHEN' | 'ADD_UNTIL',
  action: Action,
  ruleExecId: number | null,
  actionExecId: number,
  result: 'REJECT' | 'RESOLVE'
}

export type DispatchActionEvent = {
  type: 'DISPATCH_ACTION',
  timestamp: number,
  actionExecId: number,
  removed: boolean,
  isReduxAction: boolean,
  action: Action
}

export type Event = AddRuleEvent 
| RemoveRuleEvent 
| ExecRuleStartEvent 
| ExecRuleEndEvent 
| ExecActionStartEvent 
| ExecActionEndEvent 
| ExecSagaStartEvent 
| ExecSagaEndEvent 
| YieldSagaEvent
| DispatchActionEvent

type CB = (event:Event) => mixed

let buffer = []
let listeners = []

const events = {
  push(event:Event){
    listeners.forEach(l => l(event))
    return buffer.push(event)
  },
  addListener(cb:CB, applyPastEvents?:boolean){
    listeners.push(cb)
    applyPastEvents && buffer.forEach(e => cb(e))
    return cb
  },
  removeListener(cb:CB){
    listeners = listeners.filter(l => l !== cb)
  }
}

window.ruleEvents = events

export default events

if(process.env.NODE_ENV === 'development'){
  setTimeout(() => {
    runInAction(() => {
      EventList.forEach(event => {
        events.push(event)
      })
    })
  }, 500)
}
