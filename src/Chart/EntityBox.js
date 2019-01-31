// @flow
import React from 'react'
import {observer} from 'mobx-react'
import styled from 'styled-components'
import uiStore from 'modules/ui'
import type {Store} from 'modules/entities'
import { Element } from 'Scroller/Scroller'

type Props = {
  store: Store
}

export default observer<Props>(function EntityBox({store}:Props){
  switch(store.storeType){
    case 'RULE_EXECUTION': return (
      <Element name={'rule-'+store.id}>
        <RuleExecution active={uiStore.activeStore === store} status={store.status} onClick={() => uiStore.setActiveStore(store)}>
          <div className='title'>{store.ruleset.id}</div>
          {store.ruleset.rule.target === '*' && <div className='global'>global-rule</div>}
        </RuleExecution>
      </Element>
    )
    case 'ACTION_EXECUTION': return (
      <Element name={'action-'+store.id}>
        <ActionExecution removed={store.status === 'ABORTED'} active={uiStore.activeStore === store} onClick={() => uiStore.setActiveStore(store)}>
          <div className='title'>{store.action.type}</div>
          {store.ruleExecution && <div className='ruleExec'> {store.ruleExecution.ruleset.id} </div>}
        </ActionExecution>
      </Element>
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
  background: ${props => props.status !== 'CONDITION_NOT_MATCH' ? 'darkgreen' : 'darkred'};
`

const ActionExecution = styled.div`
  padding: 5px;
  cursor: pointer;
  margin-bottom: 5px;
  background: ${props => props.removed ? 'red' : 'white'};
  border: ${props => props.active ? '2px dashed black' : '1px solid black'};
  min-height: 50px;
  display: flex;
  flex-direction: column;

  .title {
    flex: 1;
  }

  .ruleExec {
    color: grey;
    font-size: 12px;
  }
`