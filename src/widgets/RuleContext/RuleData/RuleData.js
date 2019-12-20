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

export default observer<Props>(function RuleData ({rule, ruleExecution}:Props) {
  const status = ruleExecution ? rule.getStatus(ruleExecution.startEventId) : rule.status
  return (
    <Wrapper className='RuleData'>
      <div className='row'>
        <div className='label'>Status</div>
        <div className='value'>
          {status} {rule.status !== status && `(${rule.status})`}
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
        <div className='label'>Concurrency</div>
        <div className='value'>
          {rule.data.concurrency || 'DEFAULT'}
        </div>
      </div>
      <div className='row'>
        <div className='label'>Concurrency-Filter</div>
        <div className='value'>
          {rule.data.concurrencyFilter ? 'Yes' : '-'}
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
      <div className='row'>
        <div className='label'>Add-Once</div>
        <div className='value'>
          {rule.data.addOnce ? 'Yes' : '-'}
        </div>
      </div>
      <div className='row'>
        <div className='label'>Debounce</div>
        <div className='value'>
          {rule.data.debounce ? rule.data.debounce : '-'}
        </div>
      </div>
      <div className='row'>
        <div className='label'>Throttle</div>
        <div className='value'>
          {rule.data.throttle ? rule.data.throttle : '-'}
        </div>
      </div>
      <div className='row'>
        <div className='label'>Delay</div>
        <div className='value'>
          {rule.data.delay ? rule.data.delay : '-'}
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