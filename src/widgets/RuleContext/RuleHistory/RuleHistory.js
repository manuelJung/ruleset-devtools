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
  eventId: number,
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

  > .header .box {
    color: #ffc107;
    border-bottom: none;
    font-weight: bold;
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
      active: ruleExecution === currentRuleExecution
    }
    if(ruleExecution.targetActionExecution && ruleExecution.targetActionExecution.dispatchedAction){
      row['trigger'] = {
        label: ruleExecution.targetActionExecution.dispatchedAction.data.type
      }
    }
    if(ruleExecution.outputActionExecutions[0] && ruleExecution.outputActionExecutions[0].dispatchedAction){
      row['output'] = {
        label: ruleExecution.outputActionExecutions[0].dispatchedAction.data.type
      }
    }
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
        output: {
          label: sagaExecution.result
        }
      })
    }
  })

  // saga yields
  rule.sagaYields.forEach(sagaYield => {
    let row:Row = {
      label: 'yield saga ' + sagaYield.sagaType,
      eventId: sagaYield.eventId,
      output: {
        label: sagaYield.result
      }
    }
    if(sagaYield.actionExecution.dispatchedAction){
      row['trigger'] = {
        label: sagaYield.actionExecution.dispatchedAction.data.type
      }
    }

    unorderedList.push(row)
  })

  list = [...list, ...unorderedList.sort((a,b) => a.eventId > b.eventId ? 1 : -1)]

  return list
}