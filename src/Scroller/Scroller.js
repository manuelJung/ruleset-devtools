import React from 'react'

const store = {}

export class Element extends React.Component {
  ref = React.createRef()

  componentDidMount(){
    const el = this.ref.current
    store[this.props.name] = el
  }

  render(){
    return (
      <div ref={this.ref}>
        {this.props.children}
      </div>
    )
  }
}

export class Link extends React.Component {
  handleClick = () => {
    const el = store[this.props.to]
    el.scrollIntoView()
  }

  render(){
    return (
      <div onClick={this.handleClick}>
        {this.props.children}
      </div>
    )
  }
}