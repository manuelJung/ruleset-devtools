// @flow
import {observable, toJS} from 'mobx'



type Route =
| '/actions'
| '/actions/:actionExecId/action'
| '/actions/:actionExecId/sagas'
| '/actions/:actionExecId/rules'

type History = {
  path: string,
  match: {[key:string]:string},
  route: Route
}

export type RouterStore = {
  _history: History[],
  push: (path:string) => mixed,
  activeRoute: History,
  match: (route:Route) => boolean
}

const routerStore:RouterStore = observable(({
  _history: [],
  push: path => {
    let route, result, match = {}

    if(path.match(/^\/actions$/)){
      route = '/actions'
    }
    else if(result = path.match(/^\/actions\/([^/]*)\/action$/)){
      route = '/actions/:actionExecId/action'
      match.actionExecId
    }
    else if(result = path.match(/^\/actions\/([^/]*)\/sagas$/)){
      route = '/actions/:actionExecId/sagas'
      match.actionExecId
    }
    else if(result = path.match(/^\/actions\/([^/]*)\/rules$/)){
      route = '/actions/:actionExecId/rules'
      match.actionExecId
    }
    else {
      throw new Error('tried to push unknown path: ' + path)
    }
    routerStore._history.push({path, route, match})
  },
  get activeRoute () {
    const history = routerStore._history
    return history[history.length-1] || {path: '/actions', match: {}, route: '/actions'}
  },
  match: route => {
    return routerStore.activeRoute.route.includes(route)
  }
}:RouterStore))