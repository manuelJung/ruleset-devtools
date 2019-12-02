// @flow
import * as React from 'react'
import styled from 'styled-components'
import {observer} from 'mobx-react'
import posed, {PoseGroup} from 'react-pose'
import router from 'stores/router'
import * as t from 'stores/types'
import {IoIosMedal} from 'react-icons/io'

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
            key={item.data.label+item.data.store.storeType}
            style={{
              top:item.y * 30 + item.y*35 + 15,
              left:`calc(( 100% / 3 ) * ${item.x} + 10px * ${item.x+1} )`
            }}
            children={
              <React.Fragment>
                {item.data.store.storeType === 'RULE' && <div className='background'><IoIosMedal/></div>}
                <div className='box'>{item.data.label}</div>
              </React.Fragment>
            }
          />
        ))}
      </PoseGroup>
    </Wrapper>
  )
})

const tween = { type: 'tween', duration: 800}
const _Item = posed.div({
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
    opacity: 1,
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

const Item = styled(_Item)`
  width: calc(100% / 3 - 40px);
  height: 35px;
  position: absolute;

  > .box {
    position: absolute;
    box-sizing: border-box;
    border: 2px solid whitesmoke;
    color: whitesmoke;
    padding: 6px 3px;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    background: #4b5e67;
    z-index: 10;
  }

  > .background {
    position: absolute;
    font-size: 60px;
    color: white;
    top: -10px;
    left: calc(50% - 30px);
    z-index: 1;
  }
`

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
  background: #4b5e67;
  border-left: 1px solid grey;
  display: flex;
  position: relative;
  min-width: 900px;
  /* overflow-y: auto; */
`