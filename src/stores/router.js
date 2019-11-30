// @flow
import * as t from './types'

export type RouterStore = {
  route: Route,
  history: Route[],
  push: (ctx:Route) => void,
  replace: (ctx:Route) => void,
  go: (n:number) => void,
  pop: () => void
}

export type EmptyRoute = {
  type: 'EMPTY'
}

export type RuleListRoute = {
  type: 'RULE_LIST',
  activeRule?: t.Rule
}

export type GraphRoute = {
  type: 'GRAPH'
}

export type ExecutedRulesRoute = {
  type: 'EXECUTED_RULES',
  dispatchedAction: t.DispatchedAction
}

export type ExecutedSagasRoute = {
  type: 'EXECUTED_SAGAS',
  dispatchedAction: t.DispatchedAction
}

export type DispatchedActionRoute = {
  type: 'DISPATCHED_ACTION',
  dispatchedAction: t.DispatchedAction
}

export type Route = EmptyRoute 
| RuleListRoute 
| GraphRoute 
| ExecutedRulesRoute 
| ExecutedSagasRoute 
| DispatchedActionRoute