// @flow
import React from 'react'
// import Chart from 'Chart'
// import StoreDetails from 'StoreDetails'

import ActionRoute from './routes/Actions'
import {Router} from 'react-router'
import {createBrowserHistory} from 'history'

export default class App extends React.Component<{}> {
  render() {
    return (
      <div className="App" style={{height:'100%'}}>
        <Router history={createBrowserHistory()}>
          <ActionRoute/>
        </Router>
        {/* <Chart />
        <StoreDetails/> */}
      </div>
    )
  }
}
