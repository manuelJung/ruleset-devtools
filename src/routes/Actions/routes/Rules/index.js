// @flow
import React from 'react'
import styled from 'styled-components'
import {observer} from 'mobx-react'
import dataStore from 'modules/store'
import {toJS} from 'mobx'

type Props = {
  actionExecId: number | null
}

export default observer<Props>(function RulesRoute(props:Props){
  if(props.actionExecId === null) return null
  const ruleExecutions = dataStore._ruleExecutions.byActionExecId[props.actionExecId]
  if(!ruleExecutions) return null
  return (
    <Wrapper>
      {ruleExecutions.map(store => (
        <div key={store.id} className='rule-execution'>
          <div className='title'>{store.ruleset.rule.id}</div>
          <div className='status'>{store.status}</div>
        </div>
      ))}
    </Wrapper>
  )
})

const Wrapper = styled.section`
  padding: 40px;

  > .rule-execution {
    padding: 5px;
    margin-top: 10px;
    display: flex;
    align-items: center;
    background: #52626a;
    height: 40px;
    border: 1px solid black;
    > .title {
      color: #e8f1f5;
      flex: 1;
      font-size: 19px;
    }
    > .status {
      border: 1px solid black;
      padding: 5px;
      margin-right: 10px;
      background: #8bc34a;
    }
  }
`