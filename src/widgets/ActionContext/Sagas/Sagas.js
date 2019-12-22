// @flow
import * as React from 'react'
import styled from 'styled-components'
import {observer} from 'mobx-react'
import * as t from 'stores/types'
import router from 'stores/router'

type Props = {
  actionExecution: t.ActionExecution
}

export default observer(function Sagas ({actionExecution}:Props) {
  if(!actionExecution.sagaYields) return (
    <Wrapper className='Sagas'>
      no sagas were executed
    </Wrapper>
  )
  return (
    <Wrapper className='Sagas'>
      <div className='row header'>
        <div className='cell'>Rule-Id</div>
        <div className='cell'>Saga-Type</div>
        <div className='cell'>Result</div>
      </div>
      {actionExecution.sagaYields.map(sagaYield => (
        <div className='row' key={sagaYield.rule.id}>
          <div className='cell interactive' onClick={() => router.push({
          type: 'GRAPH',
          store: sagaYield.rule
        })}>{sagaYield.rule.id}</div>
          <div className='cell'>{sagaYield.sagaType}</div>
          <div className='cell'>{sagaYield.result}</div>
        </div>
      ))}
    </Wrapper>
  )
})

const Wrapper = styled.div`
  color: whitesmoke;
  box-sizing: border-box;
  padding: 10px;

  > .row {
    display: flex;
    padding: 8px;
    border-bottom: 1px solid whitesmoke;
    > .cell {
      flex: 1;
      max-width: 300px;
      margin-left: 8px;
    }

    > .interactive:hover {
      color: grey;
      cursor: pointer;
    }
  }
`