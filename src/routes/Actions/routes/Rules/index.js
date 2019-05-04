// @flow
import React from 'react'
import styled from 'styled-components'
import {observer} from 'mobx-react'
import dataStore from 'modules/store'
import {toJS} from 'mobx'
import ReactJson from 'react-json-view'

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
          <div className='headline'>
            <div className='title'>{store.ruleset.rule.id}</div>
            <RuleStatus status={store.status}>{store.status}</RuleStatus>
          </div>
          <div className='info'>
            <div className='row'>
              <div className='label'>rules added</div>
              <div className='value'>
                <ReactJson 
                  name={null} 
                  enableClipboard={false}
                  src={toJS(store.ruleset.rule)} 
                  collapsed={2} 
                  displayDataTypes={false} 
                  collapseStringsAfterLength={200}
                />
              </div>
            </div>
          </div>
        </div>
      ))}
    </Wrapper>
  )
})

const Wrapper = styled.section`
  padding: 40px;

  > .rule-execution {
    > .headline {
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
        font-size: 16px;
      }
    }
    > .info {
      > .row {
        border: 1px solid black;
        border-top: none;
        display: flex;
        background: #d7e5ec;
        > .label {
          padding: 5px;
          flex: 1;
        }
        > .value {
          padding: 5px;
          flex: 2;
          > * {margin-right: 10px;}
        }
      }
    }
  }
`

const RuleStatus = styled.div`
  border: 1px solid black;
  padding: 5px;
  margin-right: 10px;
  font-size: 14px;
  background: ${props => props.status === 'RESOLVED' ? '#8bc34a' : '#ffeb3b'};
`