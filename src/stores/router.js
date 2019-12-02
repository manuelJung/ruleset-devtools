// @flow
import * as t from './types'
import {observable, toJS, runInAction} from 'mobx'

export type Router = {
  route: Route,
  history: Route[],
  push: (ctx:Route) => void,
  replace: (ctx:Route) => void,
  go: (n:number) => void,
  pop: () => void,
  toJs: () => Router
}

export type EmptyRoute = {
  type: 'EMPTY'
}

export type RuleListRoute = {
  type: 'RULE_LIST',
  activeRule?: t.Rule
}

export type GraphRoute = {
  type: 'GRAPH',
  store: t.Action | t.Rule 
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

const router:Router = observable(({
  route: {type: 'EMPTY'},
  history: [],
  push(route){
    runInAction(() => {
      router.history.push(router.route)
      router.route = route
    })
  },
  replace(route){
    router.route = route
  },
  go(){},
  pop(){},

  toJs(){
    return toJS(this)
  }
}:Router))

window.router = router

export default router