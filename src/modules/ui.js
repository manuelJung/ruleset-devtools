// @flow
import {observable} from 'mobx'
import type {Store} from './entities'


export type UIStore = {
  activeStore: Store | null,
  setActiveStore: (store:Store|null) => mixed
}

const uiStore:UIStore = observable(({
  activeStore: null,
  setActiveStore(store){
    this.activeStore = store
  }
}:UIStore))

export default uiStore