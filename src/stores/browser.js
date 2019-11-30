// @flow
import throttle from 'utils/throttle'
import {observable} from 'mobx'

export type Browser = {
  width: number,
  height: number
}

const browser:Browser = observable(({
  // $FlowFixMe
  width: window.innerWidth || document.body.clientWidth,
  // $FlowFixMe
  height: window.innerHeight || document.body.clientHeight
}:Browser))

window.addEventListener("resize", throttle(() => {
  // $FlowFixMe
  browser.width = window.innerWidth || document.body.clientWidth
  // $FlowFixMe
  browser.height = window.innerHeight || document.body.clientHeight
}, 300))

export default browser