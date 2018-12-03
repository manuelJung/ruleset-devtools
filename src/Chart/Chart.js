// @flow
import React from 'react'
import {observer} from 'mobx-react'
import styled from 'styled-components'

import store from 'modules/store'

type Props = {}

export default observer<Props>(function Chart(){
  return (
    <Wrapper>
      {store.actionExecutions.map(actionExecution => (
        <Row key={actionExecution.id}>
          <Action>
            <div className='title'>{actionExecution.action.type}</div>
            {actionExecution.ruleExecution && <div className='ruleExec'>
              {actionExecution.ruleExecution.rule.id}
            </div>}
          </Action>
          <hr/>
          {actionExecution.assignedRuleExecutions.map(ruleExecution => (
            <RuleExec status={ruleExecution.status} key={ruleExecution.id}>
              <div className='title'>{ruleExecution.ruleId}</div>
              {ruleExecution.rule.target === '*' && <div className='global'>global-rule</div>}
            </RuleExec>
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