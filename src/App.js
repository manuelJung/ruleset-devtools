// @flow
import React from 'react'
// import Chart from 'Chart'
// import StoreDetails from 'StoreDetails'

import ActionRoute from './routes/Actions'

export default class App extends React.Component<{}> {
  render() {
    return (
      <div className="App" style={{height:'100%'}}>
        <ActionRoute/>
        {/* <Chart />
        <StoreDetails/> */}
      </div>
    )
  }
}
