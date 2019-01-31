// @flow
import React from 'react'
import Chart from 'Chart'
import StoreDetails from 'StoreDetails'

export default class App extends React.Component<{}> {
  render() {
    return (
      <div className="App">
        <Chart />
        {/* <StoreDetails/> */}
      </div>
    )
  }
}
