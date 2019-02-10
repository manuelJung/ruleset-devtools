// @flow
import React from 'react'
import {observer} from 'mobx-react'
import styled from 'styled-components'
import store from 'modules/store'

type Props = {}

export default observer<Props>(function ActionLayout(){
  return (
    <Wrapper className='ActionLayout'>
      <div className='action-list'>
        {store.actionExecutions.map(actionExecution => (
          <div key={actionExecution.id}>
            {actionExecution.action.type}
          </div>
        ))}
      </div>
      <div className='content'></div>
    </Wrapper>
  )
})

const Wrapper = styled.section`
  display: flex;
  height: 100%;

  > .action-list {
    flex: 1;
    height: 100%;
    background: steelblue;
  }

  > .content {
    flex: 2;
    height: 100%;
    background: silver;
  }
`