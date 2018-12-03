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
`

const Row = styled.section`
  min-width: 200px;
  max-width: 300px;
  padding: 5px;
`

const Action = styled.div`
  padding: 5px;
  margin-bottom: 5px;
  border: 1px solid black;
  min-height: 50px;
`

const RuleExec = styled.div`
  padding: 5px;
  margin-bottom: 5px;
  border: 1px solid black;
  background: ${props => props.status === 'CONDITION_MATCH' ? 'green' : 'red'};
`