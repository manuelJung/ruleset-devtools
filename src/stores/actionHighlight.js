// @flow
import {observable, toJS, reaction} from 'mobx'
import router from './router'

type Store = {
  activeExecId: null | number,
  setExecId: (execId:number) => void,
  clearExecId: () => void,
  createHandle: (execId?:number) => Object
}

const store:Store = observable(({
  activeExecId: null,
  setExecId: id => {
    store.activeExecId = id
  },
  clearExecId: () => {
    store.activeExecId = null
  },
  createHandle: id => {
    if(!id) return {}
    reaction(() => router.route, () => store.clearExecId())
    return {
      onMouseEnter: () => store.setExecId(id),
      onMouseLeave: () => store.clearExecId()
    }
  }
}:Store))

export default store