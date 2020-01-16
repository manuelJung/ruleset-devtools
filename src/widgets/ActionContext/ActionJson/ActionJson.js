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
  if(!actionExecution) return ''
  if(!actionExecution.dispatchedAction) return ''
  return (
    <Wrapper className='ActionJson'>
      <div className='wrapper'>
        <ReactJson 
          theme='monokai'
          name={null} 
          enableClipboard={false}
          src={toJS(actionExecution.dispatchedAction.data)} 
          collapsed={2} 
          displayDataTypes={false} 
          collapseStringsAfterLength={200}
        />
      </div>
    </Wrapper>
  )
})

const Wrapper = styled.div`
  position: relative;
  box-sizing: border-box;
  padding: 10px;
  width: 100%;
  height: 100%;
  background: rgb(39, 40, 34);

  > .wrapper {
    position: absolute;
    left: 0;
    right: 0;
    top:0;
    bottom:0;
    overflow: auto;
  }
`