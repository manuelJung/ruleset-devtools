// @flow
import * as React from 'react'
import styled from 'styled-components'
import {observer} from 'mobx-react'
import posed, {PoseGroup} from 'react-pose'
import router from 'stores/router'
import * as t from 'stores/types'
import {IoIosMedal} from 'react-icons/io'

function calculateActionGraph (action:t.Action, actionExecution?:t.ActionExecution) {
  const graph = {items:[]}
  // source-rules
  // if(actionExecution){
  //   console.log(actionExecution.creatorRuleExecution.rule === action.creatorRules[0])
  // }
  action.creatorRules.forEach((rule,i) => graph.items.push({
    x: 0,
    y: i,
    data: {
      label: rule.id,
      store: rule,
      creators: rule.targetActions.length,
      assigned: rule.outputActions.length,
      isCreator: actionExecution && actionExecution.creatorRuleExecution 
        ? actionExecution.creatorRuleExecution.rule.id === rule.id
        : false
    }
  }))
  // target
  graph.items.push({
    x: 1,
    y: 0,
    data: {
      label: action.type,
      store: action,
      creators: 0,
      assigned: 0
    }
  })
  // assigned rules
  action.attachedRules.forEach((rule,i) => graph.items.push({
    x: 2,
    y: i,
    data: {
      label: rule.id,
      store: rule,
      creators: rule.targetActions.length,
      assigned: rule.outputActions.length,
      status: (()=> {
        if(!actionExecution) return null
        const ruleExecution = actionExecution.assignedRuleExecutions.find(ruleExecution => ruleExecution.rule === rule)
        if(!ruleExecution) return null
        switch(ruleExecution.status){
          case 'PENDING': return {color: '#009688;', label: 'pending'}
          case 'RESOLVED': return {color: '#009688;', label: 'executed'}
          case 'CONDITION_NOT_MATCH': return {color: '#8e8532', label: 'condition not matched'}
          case 'SKIP': return {color: '#8e8532', label: 'skiped'}
          case 'CONCURRENCY_REJECTION': return {color: '#E91E63', label: 'aborted'}
          default: return null
        }
      })()
    }
  }))
  return graph
}

function calculateRuleGraph (rule:t.Rule, ruleExecution?:t.RuleExecution) {
  const graph = {items:[]}
  // source actions
  rule.targetActions.forEach((action,i) => graph.items.push({
    x:0,
    y:i,
    data: {
      label: action.type,
      store: action,
      creators: action.creatorRules.length,
      assigned: action.attachedRules.length
    }
  }))
  // target
  graph.items.push({
    x:1,
    y:0,
    data: {
      label: rule.id,
      store: rule,
      creators: 0,
      assigned: 0
    }
  })
  // output actions
  rule.outputActions.forEach((action,i) => graph.items.push({
    x:2,
    y:i,
    data: {
      label: action.type,
      store: action,
      creators: action.creatorRules.length,
      assigned: action.attachedRules.length
    }
  }))

  return graph
}
let direction = 'right'
export default observer(function Graph () {
  if(router.route.type !== 'GRAPH') return null
  const graph = router.route.store.storeType === 'ACTION'
    ? calculateActionGraph(router.route.store, router.route.actionExecution)
    : calculateRuleGraph(router.route.store, router.route.ruleExecution)

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
                {item.data.creators > 0 && <div className='badge creators'>{item.data.creators}</div>}
                {item.data.assigned > 0 && <div className='badge assigned'>{item.data.assigned}</div>}
                {item.data.isCreator && <div className='badge creator'>creator</div>}
                {item.data.status && <div className='badge status' style={{background:item.data.status.color}}>
                  {item.data.status.label}
                </div>}
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

  > .badge {
    position: absolute;
    padding: 3px 5px;
    background: #009688;
    border-radius: 3px;
    z-index: 10;
    font-size: 12px;
    color: whitesmoke;
  }

  > .assigned { top: -5px; right: -5px;}
  > .creators { top: -5px; left: -5px;}
  > .creator { bottom: -14px; left: -5px;}
  > .status { bottom: -14px; left: -5px;}
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