import * as React from 'react'
import styled from 'styled-components'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error(error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <Wrapper>
          <div>
            <h1>An error happened</h1>
            <p>
              We have still issues with hmr. If reloading does not work
              close the devtools and reload whole application.
            </p>
            <button onClick={() => this.setState({hasError:false})}>
              reload
            </button>
          </div>
        </Wrapper>
      )
    }

    return this.props.children; 
  }
}

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  background: rgb(39,40,34);
  display: flex;
  align-items: center;
  justify-content: center;
  color: whitesmoke;

  > div {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: whitesmoke;
    max-width: 400px;
    padding: 20px;
    text-align: center;

    > button {
      border: none;
      background: #009688;
      padding: 20px;
      display: inline-block;
      width: 100%;
      font-size: 20px;
      text-transform: uppercase;
      color: white;
      cursor: pointer;
    }
  }
`