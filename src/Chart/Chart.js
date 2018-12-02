// @flow
import React from 'react'
import {observer} from 'mobx-react'
import styled from 'styled-components'

import ruleStore from 'modules/rules'
import actionStore from 'modules/actions'

type Props = {}

export default observer<Props>(function Chart(){
  return (
    <Wrapper>
      {actionStore.actions.map(([action, rules]) => (
        <Row key={action.type}>
          <Action>{action.type}</Action>
          {rules.map(rule => (
            <Action key={rule.id}>{rule.id}</Action>
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
`