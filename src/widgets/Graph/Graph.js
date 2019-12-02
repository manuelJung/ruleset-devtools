// @flow
import * as React from 'react'
import styled from 'styled-components'
import {useObserver} from 'mobx-react'
import {observable} from 'mobx'
import posed, {PoseGroup} from 'react-pose'

const graph = {
  columns: 3,
  items: [
    { y: 0, x: 0, data: {
      label: 'products/TOGGLE_TAG'
    }},{ y: 1, x: 0, data: {
      label: 'products/SET_QUERY'
    }},{ y: 2, x: 0, data: {
      label: 'products/TOGGLE_CATEGORY'
    }},{ y: 0, x: 1, data: {
      label: 'products/TRIGGER_SEARCH'
    }},{ y: 0, x: 2, data: {
      label: 'products/FETCH_SEARCH_REQUEST'
    }},{ y: 1, x: 2, data: {
      label: 'test'
    }}
  ]
}

const graphNext = {
  columns: 3,
  items: [
    { y: 0, x: 0, data: {
      label: 'products/TRIGGER_SEARCH'
    }},{ y: 0, x: 1, data: {
      label: 'products/FETCH_SEARCH_REQUEST'
    }},{ y: 0, x: 2, data: {
      label: 'products/FETCH'
    }}
  ]
}

const state = observable({
  graph: 0
})

export default function Graph () {
  const [data, setData] = React.useState(graph)
  return useObserver(() =>
    <Wrapper className='Graph'>
      <PoseGroup>
        {data.items.map(item => (
          <Item 
            item={item}
            onClick={() => setData(data===graph ? graphNext : graph)}
            className='cell'
            key={item.data.label}
            children={item.data.label}
            style={{
              top:item.y * 30 + item.y*35 + 15,
              left:`calc(( 100% / 3 ) * ${item.x} + 10px * ${item.x+1} )`
            }}/>
        ))}
      </PoseGroup>
    </Wrapper>
  )
}
const tween = { type: 'tween', duration: 500}
const Item = posed.div({
  flip: {
    transition: tween,
  },
  enter: {
    y: 0,
    x: 0,
    opacity: 1,
    transition: tween,
  },
  exit: {
    y: ({item}) => item.x === 0 ? 0 : 300,
    x: ({item}) => item.x === 0 ? -300 : 0,
    opacity: 0,
    transition: tween
  }
})

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
  background: #4b5e67;
  border-left: 1px solid grey;
  display: flex;
  position: relative;
  min-width: 900px;
  /* overflow-y: auto; */

  > .cell {
    width: calc(100% / 3 - 40px);
    height: 35px;
    position: absolute;
    box-sizing: border-box;
    border: 1px solid white;
    color: whitesmoke;
    padding: 6px 3px;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`