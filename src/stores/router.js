// @flow
import * as t from './types'
import {observable, toJS, runInAction} from 'mobx'

export type Router = {
  route: Route,
  history: Route[],
  historyPointer: number,
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
  store: t.Action | t.Rule,
  actionExecution?: t.ActionExecution | null,
  ruleExecution?: t.RuleExecution | null
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
  history: [{type:'EMPTY'}],
  historyPointer: 1,
  push(route){
    runInAction(() => {
      if(router.history.length !== router.historyPointer){
        router.history = router.history.slice(0, router.historyPointer)
      }
      router.history.push(route)
      router.route = route
      router.historyPointer++
    })
  },
  replace(route){
    runInAction(() => {
      if(router.history.length !== router.historyPointer){
        router.history = router.history.slice(0, router.historyPointer)
      }
      router.history[router.historyPointer] = route 
      router.route = route
    })
  },
  go(number){
    runInAction(() => {
      const next = router.historyPointer + number
      router.historyPointer = next
      router.route = router.history[next] || {type:'EMPTY'}
    })
  },
  pop(){
    router.go(-1)
  },

  toJs(){
    return toJS(this)
  }
}:Router))

window.router = router

export default router