// @flow

import type {Event} from './entities'
import EventList from './eventlist'

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
    EventList.forEach(event => {
      events.push(event)
    })
  }, 500)
}
