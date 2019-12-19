// @flow
import * as React from 'react'
import styled from 'styled-components'
import {observer} from 'mobx-react'
import {toJS} from 'mobx'
import ReactJson from 'react-json-view'
import * as t from 'stores/types'

type Props = {
  actionExecution: t.ActionExecution | null
}

export default observer<Props>(function ActionJson({actionExecution}:Props){
  if(!actionExecution) return 'no action found'
  if(!actionExecution.dispatchedAction) return 'no action found'
  return (
    <Wrapper className='ActionJson'>
      <ReactJson 
        theme='monokai'
        name={null} 
        enableClipboard={false}
        src={toJS(actionExecution.dispatchedAction.data)} 
        collapsed={2} 
        displayDataTypes={false} 
        collapseStringsAfterLength={200}
      />
    </Wrapper>
  )
})

const Wrapper = styled.div`
  padding: 10px;
  width: 100%;
  height: 100%;
  overflow: scroll;
  background: rgb(39, 40, 34);
`