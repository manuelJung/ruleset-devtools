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

export default observer<Props>(function SagaYields(props:Props){
  if(!props.actionExecId) return null
  const sagaYields = dataStore._sagaYields.byActionExecId[props.actionExecId]
  if(!sagaYields) return null

  return (
    <Wrapper className='SagaYield'>
      {sagaYields.map(sagaYield => 
        <div className='saga' key={sagaYield.saga.ruleset.rule.id}>
          <div className='headline'>
            <div className='title'>{sagaYield.saga.ruleset.rule.id}</div>
            <Status status={sagaYield.result}>{sagaYield.result}</Status>
          </div>
          <div className='info'>
            <div className='row'>
              <div className='label'>saga status</div>
              <div className='value'>
                {sagaYield.nextSagaStatus}
              </div>
            </div>
          </div>
        </div>
      )}
    </Wrapper>
  )
})

const Wrapper = styled.div`
  padding: 40px;

  > .saga {
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

const Status = styled.div`
  border: 1px solid black;
  padding: 5px;
  margin-right: 10px;
  font-size: 14px;
  background: ${props => props.status === 'RESOLVE' ? '#8bc34a' : '#ffeb3b'};
`