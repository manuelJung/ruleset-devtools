// @flow
import * as React from 'react'
import styled from 'styled-components'
import * as t from 'stores/types'
import {observer} from 'mobx-react'
import {IoIosCheckbox} from 'react-icons/io'

type Props = {
  rule: t.Rule
}

export default observer<Props>(function RuleData ({rule}:Props) {
  return (
    <Wrapper className='RuleData'>
      <div className='row'>
        <div className='label'>Add-When Saga</div>
        <div className='value'><IoIosCheckbox/></div>
      </div>
      <div className='row'>
        <div className='label'>Add-Until Saga</div>
        <div className='value'><IoIosCheckbox/></div>
      </div>
      <div className='row'>
        <div className='label'>Status</div>
        <div className='value'>
          <span style={{color:'#8bc34a'}}>ACTIVE</span>
        </div>
      </div>
    </Wrapper>
  )
})

const Wrapper = styled.div`
  color: whitesmoke;
  padding: 10px;

  > .row {
    display: flex;
    padding: 10px;
    border-bottom: 1px solid grey;

    > .label {
      width: 300px;
    }
    > .value {
      flex: 1;
      > svg {font-size: 18px; color: #8bc34a;}
    }
  }
`