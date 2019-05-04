// @flow
import * as React from 'react'
import styled from 'styled-components'
import {observer} from 'mobx-react'
import dataStore from 'modules/store'
import {toJS} from 'mobx'
import ReactJson from 'react-json-view'

type Props = {
  actionExecId: number | null
}

export default observer<Props>(function Action(props:Props){
  if(props.actionExecId === null) return null
  const actionExecution = dataStore._actionExecutions.byId[props.actionExecId]
  if(!actionExecution) return null
  return (
    <Wrapper className='Action'>
      <ReactJson 
        name={null} 
        enableClipboard={false}
        src={toJS(actionExecution.action)} 
        collapsed={2} 
        displayDataTypes={false} 
        collapseStringsAfterLength={200}
      />
    </Wrapper>
  )
})

const Wrapper = styled.div`
  padding: 20px;
  width: 100%;
  height: 100%;
  overflow: scroll;
  background: #d7e5ec;
`