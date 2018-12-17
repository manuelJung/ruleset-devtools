// @flow
import React from 'react'
import {observer} from 'mobx-react'
import styled from 'styled-components'
import uiStore from 'modules/ui'
import type {Store} from 'modules/entities'

type Props = {
  store: Store
}

export default observer<Props>(function EntityBox({store}){
  switch(store.storeType){
    case 'RULE_EXECUTION': return (
      <RuleExecution active={uiStore.activeStore === store} status={store.status} onClick={() => uiStore.setActiveStore(store)}>
        <div className='title'>{store.ruleId}</div>
        {store.rule.target === '*' && <div className='global'>global-rule</div>}
      </RuleExecution>
    )
    case 'ACTION_EXECUTION': return (
      <ActionExecution removed={store.removed} active={uiStore.activeStore === store} onClick={() => uiStore.setActiveStore(store)}>
        <div className='title'>{store.action.type}</div>
        {store.ruleExecution && <div className='ruleExec'> {store.ruleExecution.rule.id} </div>}
      </ActionExecution>
    )
    case 'RULESET': return <div/>
    default: return <div/>
  }
})

const RuleExecution = styled.div`
  padding: 5px;
  cursor: pointer;
  margin-bottom: 5px;
  color: white;
  border: ${props => props.active ? '2px dashed black' : '1px solid black'};
  background: ${props => props.status === 'CONDITION_MATCH' ? 'darkgreen' : 'darkred'};
`

const ActionExecution = styled.div`
  padding: 5px;
  cursor: pointer;
  margin-bottom: 5px;
  background: ${props => props.removed ? 'red' : 'white'};
  border: ${props => props.active ? '2px dashed black' : '1px solid black'};
  min-height: 50px;
`