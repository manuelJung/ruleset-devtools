// @flow
import React from 'react'
import {observer} from 'mobx-react'
import styled from 'styled-components'
import store from 'modules/store'
import EntityBox from './EntityBox'

type Props = {}

export default observer<Props>(function Chart(){
  return (
    <Wrapper>
      {store.actionExecutions.map(actionExecution => (
        <Row key={actionExecution.id}>
          <EntityBox store={actionExecution}/>
          <hr/>
          {actionExecution.assignedRuleExecutions.map(ruleExecution => (
            <EntityBox key={ruleExecution.id} store={ruleExecution}/>
          ))}
        </Row>
      ))}
    </Wrapper>
  )
})


const Wrapper = styled.section`
  display: flex;
  overflow-x: scroll;
`

const Row = styled.section`
  min-width: 300px;
  max-width: 400px;
  padding: 5px;
`