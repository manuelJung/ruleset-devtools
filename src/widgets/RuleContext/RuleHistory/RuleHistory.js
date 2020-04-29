// @flow
import * as React from 'react'
import styled from 'styled-components'
import {observer} from 'mobx-react'
import * as t from 'stores/types'
import router from 'stores/router'

type Props = {
  rule: t.Rule,
  ruleExecution?: t.RuleExecution | null
}

type Row = {
  label: string,
  eventId: number,
  active?:boolean,
  trigger?: {
    label: string,
    onClick?: () => mixed
  }[],
  output?: {
    label: string,
    onClick?: () => mixed
  }[]
}

export default observer(function RuleHistory({rule, ruleExecution}:Props){
  let rows:Row[] = calculateRows(rule, ruleExecution)
  return (
    <Wrapper className='RuleHistory'>
      <div className='row header'>
        <div className='trigger'>
          <div className='box'>Trigger</div>
        </div>
        <div className='event'>
          <div className='box'>Event</div>
        </div>
        <div className='output'>
          <div className='box'>Output</div>
        </div>
      </div>
      {rows.map((row,i) => (
        <div className='row' key={i}>
          <div className='trigger'>
            {row.trigger && row.trigger.map((trigger,i) => (
              <Box interactive={!!trigger.onClick} key={i} onClick={trigger.onClick}>
                {trigger.label}
              </Box>
            ))}
          </div>
          <div className='event'>
            <Box style={{color:row.active && '#8bc34a'}}>{row.label}</Box>
          </div>
          <div className='output'>
            {row.output && row.output.map((output,i) => (
              <Box interactive={!!output.onClick} key={i} onClick={output.onClick}>
                {output.label}
              </Box>
            ))}
          </div>
        </div>
      ))}
    </Wrapper>
  )
})

const Wrapper = styled.div`
  display: table;
  table-layout: fixed;
  width: 100%;
  flex-direction: column;
  padding-bottom: 30px;
  box-sizing: border-box;

  > .row {
    display: table-row;
    > * {
      display:table-cell;
      width:33.33%;
      height: 40px;
      text-align:center;
      word-wrap: break-word;
    }
  }

  > .header .box {
    color: #ffc107;
    border-bottom: none;
    font-weight: bold;
  }
`

const Box = styled.div`
  color: whitesmoke;
  padding: 8px;
  text-align: center;
  border-bottom: 1px solid whitesmoke;
  margin: 10px;

  &:hover {
    cursor: ${props => props.interactive && 'pointer'};
    color: ${props => props.interactive && 'grey'};
  }
`

function calculateRows (rule, currentRuleExecution) {
  let list = [{label:'REGISTER_RULE', eventId:-1}]
  let unorderedList = []

  // rule executions
  rule.ruleExecutions.forEach(ruleExecution => {
    let row:Row = {
      label: 'EXECUTE',
      eventId: ruleExecution.startEventId,
      active: ruleExecution === currentRuleExecution,
      trigger: [],
      output: []
    }
    if(ruleExecution.targetActionExecution && ruleExecution.targetActionExecution.dispatchedAction){
      row.trigger && row.trigger.push({
        label: ruleExecution.targetActionExecution.dispatchedAction.data.type,
        onClick: () => router.push({
          type: 'GRAPH',
          // $FlowFixMe
          store: ruleExecution.targetActionExecution.action,
          actionExecution: ruleExecution.targetActionExecution,
        })
      })
    }
    ruleExecution.outputActionExecutions.forEach(actionExecution => {
      if(!actionExecution.dispatchedAction) return
      row.output && row.output.push({
        label: actionExecution.dispatchedAction.data.type,
        onClick: () => router.push({
          type: 'GRAPH',
          store: actionExecution.action,
          actionExecution: actionExecution,
        })
      })
    })
    unorderedList.push(row)
  })

  // saga executions
  rule.sagaExecutions.forEach(sagaExecution => {
    unorderedList.push({
      label: 'start saga ' + sagaExecution.type,
      eventId: sagaExecution.startEventId
    })

    if(sagaExecution.endEventId !== null){
      unorderedList.push({
        label: 'end saga ' + sagaExecution.type,
        eventId: sagaExecution.endEventId,
        output: [{
          label: sagaExecution.result
        }]
      })
    }
  })

  // saga yields
  rule.sagaYields.forEach(sagaYield => {
    let row:Row = {
      label: 'yield saga ' + sagaYield.sagaType,
      eventId: sagaYield.eventId,
      output: [{
        label: sagaYield.result
      }],
      trigger: []
    }
    if(sagaYield.actionExecution && sagaYield.actionExecution.dispatchedAction){
      row.trigger && row.trigger.push({
        label: sagaYield.actionExecution.dispatchedAction.data.type,
        onClick: () => router.push({
          type: 'GRAPH',
          // $FlowFixMe
          store: sagaYield.actionExecution.action,
          actionExecution: sagaYield.actionExecution,
        })
      })
    }

    unorderedList.push(row)
  })

  rule.__time.status.map(row => {
    if(row.data === 'ACTIVE') unorderedList.push({
      label: 'ADD_RULE',
      eventId: row.eventId
    })
    if(row.data === 'REMOVED') unorderedList.push({
      label: 'REMOVE_RULE',
      eventId: row.eventId
    })
  })

  list = [...list, ...unorderedList.sort((a,b) => a.eventId > b.eventId ? 1 : -1)]

  return list
}