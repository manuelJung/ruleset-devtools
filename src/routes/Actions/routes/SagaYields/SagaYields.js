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
        <div key={sagaYield.timestamp}>
          {sagaYield.saga.ruleset.rule.id}
        </div>
      )}
    </Wrapper>
  )
})

const Wrapper = styled.div``