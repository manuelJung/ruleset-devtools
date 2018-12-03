// @flow
import React from 'react'
import {observer} from 'mobx-react'
import styled from 'styled-components'
import uiStore from 'modules/ui'

import type {RuleExecution, ActionExecution} from 'modules/entities'

export default observer<{}>(function StoreDetails(){
  if(!uiStore.activeStore) return null
  switch(uiStore.activeStore.storeType){
    case 'RULE_EXECUTION': return <RuleExecutionDetails store={uiStore.activeStore} />
    case 'ACTION_EXECUTION': return <ActionExecutionDetails store={uiStore.activeStore} />
    case 'RULESET': return <div/>
    default: return <div/>
  }
})


const RuleExecutionDetails = observer<{store:RuleExecution}>(function RuleExecutionDetails({store}){
  return (
    <Wrapper className='RuleExecutionDetails'>
      <div className='headline'>
        <div className='store-type'>RuleExecution</div>
        <div className='store-title'>{store.rule.id}-{store.id}</div>
      </div>
      <div className='row'>
        <div className='title'>dispatched actions</div>
        <div className='value'>{store.actionExecutions.map(o => (
          <span className='link' key={o.id} onClick={() => uiStore.setActiveStore(o)}>
            {o.action.type}
          </span>
        ))}</div>
      </div>
    </Wrapper>
  )
})

const ActionExecutionDetails = observer<{store:ActionExecution}>(function ActionExecutionDetails({store}){
  return (
    <Wrapper className='ActionExecutionDetails'>
      <div className='headline'>
        <div className='store-type'>ActionExecution</div>
        <div className='store-title'>{store.action.type}-{store.id}</div>
      </div>
      <div className='row'>
        <div className='title'>invoked by</div>
        <div className='value'>
          {store.ruleExecution && <span className='link' onClick={() => uiStore.setActiveStore(store.ruleExecution)}>
            {store.ruleExecution.rule.id}
          </span>}
        </div>
      </div>
    </Wrapper>
  )
})

const Wrapper = styled.div`
  border: 1px solid black;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  .headline {
    display: flex;
    border-bottom: 1px solid black;
    .store-type {
      padding: 5px;
      font-size: 22px;
      border-right: 1px solid black;
    }
    .store-title {
      padding: 5px;
      display: flex;
      align-items: center;
    }
  }
  .row {
    display: flex;
    .title {
      flex: 1;
      padding: 5px;
      border-right: 1px solid black;
    }
    .value {
      flex: 3;
      padding: 5px;
    }
  }

  .link {
    color: blue;
    cursor: pointer;
  }
`