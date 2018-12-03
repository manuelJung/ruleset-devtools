// @flow
import React from 'react'
import {observer} from 'mobx-react'
import styled from 'styled-components'

import type {Store} from 'modules/entities'

type Props = {
  store: Store
}

export default observer<Props>(function EntityBox({store}){
  switch(store.storeType){
    case 'RULE_EXECUTION': return (
      <RuleExecution status={store.status}>
        <div className='title'>{store.ruleId}</div>
        {store.rule.target === '*' && <div className='global'>global-rule</div>}
      </RuleExecution>
    )
    case 'ACTION_EXECUTION': return (
      <ActionExecution>
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
  margin-bottom: 5px;
  border: 1px solid black;
  background: ${props => props.status === 'CONDITION_MATCH' ? 'green' : 'red'};
`

const ActionExecution = styled.div`
  padding: 5px;
  margin-bottom: 5px;
  border: 1px solid black;
  min-height: 50px;
`