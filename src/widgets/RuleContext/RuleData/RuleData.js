// @flow
import * as React from 'react'
import styled from 'styled-components'
import * as t from 'stores/types'
import {observer} from 'mobx-react'
import {IoIosCheckbox} from 'react-icons/io'

type Props = {
  rule: t.Rule,
  ruleExecution?: t.RuleExecution | null
}

export default observer<Props>(function RuleData ({rule}:Props) {
  return (
    <Wrapper className='RuleData'>
      <div className='row'>
        <div className='label'>Status</div>
        <div className='value'>
          {rule.status}
        </div>
      </div>
      <div className='row'>
        <div className='label'>Position</div>
        <div className='value'>
          {rule.position}
        </div>
      </div>
      <div className='row'>
        <div className='label'>Weight</div>
        <div className='value'>
          {rule.weight}
        </div>
      </div>
      <div className='row'>
        <div className='label'>Condition</div>
        <div className='value'>
          {rule.data.condition ? 'Yes' : '-'}
        </div>
      </div>
      <div className='row'>
        <div className='label'>Add-When Saga</div>
        <div className='value'>
          {rule.data.addWhen ? 'Yes' : '-'}
        </div>
      </div>
      <div className='row'>
        <div className='label'>Add-Until Saga</div>
        <div className='value'>
          {rule.data.addUntil ? 'Yes' : '-'}
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
      width: 250px;
    }
    > .value {
      flex: 1;
      > svg {font-size: 18px; color: #8bc34a;}
    }
  }
`