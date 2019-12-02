// @flow
import * as React from 'react'
import styled from 'styled-components'
import {observer} from 'mobx-react'
import posed, {PoseGroup} from 'react-pose'
import router from 'stores/router'
import * as t from 'stores/types'

function calculateActionGraph (action:t.Action) {
  const graph = {items:[]}
  // source-rules
  action.creatorRules.forEach((rule,i) => graph.items.push({
    x: 0,
    y: i,
    data: {
      label: rule.id,
      store: rule
    }
  }))
  // target
  graph.items.push({
    x: 1,
    y: 0,
    data: {
      label: action.type,
      store: action
    }
  })
  // assigned rules
  action.attachedRules.forEach((rule,i) => graph.items.push({
    x: 2,
    y: i,
    data: {
      label: rule.id,
      store: rule
    }
  }))
  return graph
}

function calculateRuleGraph (rule:t.Rule) {
  const graph = {items:[]}
  // source actions
  rule.targetActions.forEach((action,i) => graph.items.push({
    x:0,
    y:i,
    data: {
      label: action.type,
      store: action
    }
  }))
  // target
  graph.items.push({
    x:1,
    y:0,
    data: {
      label: rule.id,
      store: rule
    }
  })
  // output actions
  rule.outputActions.forEach((action,i) => graph.items.push({
    x:2,
    y:i,
    data: {
      label: action.type,
      store: action
    }
  }))

  return graph
}
let direction = 'right'
export default observer(function Graph () {
  if(router.route.type !== 'GRAPH') return null
  const graph = router.route.store.storeType === 'ACTION'
    ? calculateActionGraph(router.route.store)
    : calculateRuleGraph(router.route.store)

  return (
    <Wrapper className='Graph'>
      <PoseGroup preEnterPose='preEnter'>
        {graph.items.map(item => (
          <Item 
            item={item}
            onClick={() => {
              if(item.x === 1) return
              else if (item.x === 0) direction = 'left'
              else if (item.x === 2) direction = 'right'
              router.push({
                type: 'GRAPH',
                store: item.data.store
              })
            }}
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
})

const tween = { type: 'tween', duration: 800}
const Item = posed.div({
  flip: {
    transition: tween,
  },
  enter: {
    x: 0,
    opacity: 1,
    transition: tween,
  },
  preEnter: {
    x: () => {
      if(direction === 'left') return -300
      if(direction === 'right') return 300
      return 0
    },
    opacity: 0,
    transition: tween
  },
  exit: {
    x: () => {
      if(direction === 'left') return 300
      if(direction === 'right') return -300
      return 0
    },
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