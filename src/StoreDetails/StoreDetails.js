// @flow
import React from 'react'
import {observer} from 'mobx-react'
import styled from 'styled-components'
import uiStore from 'modules/ui'
import { Link } from 'Scroller/Scroller'

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

type Props1 = {
  store: RuleExecution
}


const RuleExecutionDetails = observer<Props1>(function RuleExecutionDetails({store}:Props1){
  let ruleText = JSON.stringify(store.ruleset.rule, null, 2) || ''
  ruleText = ruleText.replace(/ /g, ' ')
  return (
    <Wrapper className='RuleExecutionDetails'>
      <div className='headline'>
        <div className='store-type'>Rule</div>
        <div className='store-title'>{store.ruleset.rule.id}-{store.id}</div>
      </div>
      <div className='row'>
        <div className='title'>dispatched actions</div>
        <div className='value'>{store.actionExecutions.map(o => (
          <Link key={o.id} to={'action-'+o.id}>
            <div className='link' onClick={() => uiStore.setActiveStore(o)}>
              {o.action.type}
            </div>
          </Link>
        ))}</div>
      </div>
      <div className='row'>
        <div className='title'>Status</div>
        <div className='value'>{store.status}</div>
      </div>
      <div className='row'>
        <div className='title'>Rule</div>
        <div className='value'>{ruleText.split('\n').map(line =>(
          <React.Fragment key={line}>
            <span>{line}</span>
            <br/>
          </React.Fragment>
        ))}</div>
      </div>
    </Wrapper>
  )
})

type Props2 = {store: ActionExecution}

const ActionExecutionDetails = observer<Props2>(function ActionExecutionDetails({store}:Props2){
  return (
    <Wrapper className='ActionExecutionDetails'>
      <div className='headline'>
        <div className='store-type'>Action</div>
        <div className='store-title'>{store.action.type}-{store.id}</div>
      </div>
      <div className='row'>
        <div className='title'>invoked by rule</div>
        <div className='value'>
          {store.ruleExecution && <span className='link' onClick={() => uiStore.setActiveStore(store.ruleExecution)}>
            <Link to={'rule-'+store.ruleExecution.id}>
              {store.ruleExecution.ruleset.rule.id}
            </Link>
          </span>}
        </div>
      </div>
      <div className='row'>
        <div className='title'>action</div>
        <div className='value'>
          <span>{JSON.stringify(store.action, null, 2).split('\n').map(line =>(
          <React.Fragment key={line}>
            <span>{line}</span>
            <br/>
          </React.Fragment>
        ))}</span>
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
      min-width: 200px;
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
    border-bottom: 1px solid black;
    &:last-child {border-bottom: none;}
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
