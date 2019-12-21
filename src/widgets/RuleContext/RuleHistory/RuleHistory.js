// @flow
import * as React from 'react'
import styled from 'styled-components'
import {observer} from 'mobx-react'
import * as t from 'stores/types'

type Props = {
  rule: t.Rule,
  ruleExecution?: t.RuleExecution | null
}

type Row = {
  label: string,
  active?:boolean,
  trigger?: {
    label: string,
    onClick?: () => mixed
  },
  output?: {
    label: string,
    onClick?: () => mixed
  }
}

const list = [
  {
    label: 'REGISTER_RULE',
  },{
    label: 'start saga ADD_WHEN'
  },{
    label: 'yield saga ADD_WHEN',
    trigger: {
      label: 'LOCATION_CHANGE'
    },
    output: {
      label: 'RESOLVED'
    }
  },{
    label: 'end saga ADD_WHEN',
    output: {
      label: 'ADD_RULE'
    }
  },{
    label: 'ADD_RULE'
  },{
    label: 'start saga ADD_UNTIL'
  },{
    label: 'EXECUTE',
    active: true,
    trigger: {
      label: 'FETCH_REQUEST'
    },
    output: {
      label: 'FETCH_SUCCESS'
    }
  }
]

export default observer(function RuleHistory({rule}:Props){
  let rows:Row[] = []
  rows = list
  return (
    <Wrapper className='RuleHistory'>
      {rows.map((row,i) => (
        <div className='row' key={i}>
          <div className='trigger'>
            {row.trigger && <div className='box'>{row.trigger.label}</div>}
          </div>
          <div className='event'><div className='box' style={{color:row.active && '#8bc34a'}}>{row.label}</div></div>
          <div className='output'>
            {row.output && <div className='box'>{row.output.label}</div>}
          </div>
        </div>
      ))}
    </Wrapper>
  )
})

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding-bottom: 30px;
  box-sizing: border-box;

  > .row {
    display: flex;
    > * {flex:1;display:flex;}
    .trigger {justify-content: flex-end;}
    .event {flex:0;}
    .output {justify-content: flex-start;}
  }

  .box {
    color: whitesmoke;
    padding: 8px;
    width: 250px;
    text-align: center;
    border-bottom: 1px solid whitesmoke;
    margin: 10px;
  }

`