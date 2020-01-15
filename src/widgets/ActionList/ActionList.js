// @flow
import * as React from 'react'
import styled from 'styled-components'
import rootStore from 'stores/root'
import router from 'stores/router'
import {useObserver} from 'mobx-react'

export default function ActionList () {
  const [commitIndex, setCommitIndex] = React.useState(0)
  const [filter, setFilter] = React.useState('')

  const calcHighlight = dispatchedAction => {
    if(router.route.type !== 'GRAPH') return false

    let {actionExecution, ruleExecution} = router.route
    if(!actionExecution && ruleExecution){
      actionExecution = ruleExecution.targetActionExecution
    }

    if(!actionExecution) return false
    if(actionExecution.dispatchedAction === dispatchedAction) return 'ACTIVE'
    if(actionExecution.creatorRuleExecution 
    && actionExecution.creatorRuleExecution.targetActionExecution
    && actionExecution.creatorRuleExecution.targetActionExecution.dispatchedAction === dispatchedAction) return 'RELATED_SOURCE'
    if(actionExecution.assignedRuleExecutions.find(ruleExecution => ruleExecution.outputActionExecutions.find(actionExecution => actionExecution.dispatchedAction === dispatchedAction))) return 'RELATED_OUTPUT'

    return false
  }

  const showInList = dispatchedAction => {
    if(!filter) return true
    const queries = filter.split('|')
    return queries.some(query => {
      if(query[0] === '!') return !dispatchedAction.data.type.includes(query.slice(1))
      else return dispatchedAction.data.type.includes(query)
    })
  }

  return useObserver(() =>
    <Wrapper className='ActionList'>
      <div className='filter-wrapper'>
        <input type='text' placeholder='filter...' value={filter} onChange={e => setFilter(e.target.value)}/>
        <button onClick={() => setCommitIndex(rootStore.dispatchedActions.length)}>commit</button>
      </div>
      <div className='list'>
        {rootStore.dispatchedActions
          .slice(commitIndex)
          .filter(showInList)
          .map(dispatchedAction => (
          <Item 
            key={dispatchedAction.id} 
            highlight={calcHighlight(dispatchedAction)}
            onClick={() => router.push({
              type: 'GRAPH',
              store: dispatchedAction.actionExecution.action,
              actionExecution: dispatchedAction.actionExecution
            })}
          >
            <div className='label'>{dispatchedAction.data.type}</div>
            <div className='badges'>
              {!!dispatchedAction.assignedRuleExecutions.length && (
                <div className='rule-executions'>{dispatchedAction.assignedRuleExecutions.length}</div>
              )}
              {!!dispatchedAction.sagaYields.length && (
                <div className='saga-yields'>{dispatchedAction.sagaYields.length}</div>
              )}
            </div>
          </Item>
        ))}
      </div>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  background: rgb(39, 40, 34);

  > .filter-wrapper {
    display: flex;
    padding: 5px;
    border-bottom: 1px solid grey;
    > input {
      background: none;
      border:none;
      color: white;
      font-size: 16px;
      padding: 5px;
      flex: 1;
      width: 100%;
      &:focus {outline:none;}

      &::placeholder {
        color: whitesmoke;
      }
    }
    > button {
      padding: 5px;
      background: none;
      font-size: 14px;
      cursor: pointer;
      border: 1px solid whitesmoke;
      color: whitesmoke;
    }
  }
  
  > .list {
    overflow: scroll;
    height: calc(100% - 140px);
    padding-bottom: 100px;
  }
`

const Item = styled.div`
  display: flex;
  position: relative;
  border-top: 1px solid #9e9e9e;
  &:hover {
    background: #607d8b;
    cursor: pointer;
  }

  ${props => props.highlight === 'ACTIVE' && `
    background: #795548 !important;
  `}



  > .label {
    flex: 1;
    padding: 8px;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #e2e0e0;
    font-size: 14px;
    ${props => props.highlight === 'RELATED_SOURCE' && `
      color: #8bc34a;
    `}

    ${props => props.highlight === 'RELATED_OUTPUT' && `
      color: #ffc107;
    `}
  }

  > .badges {
    display: flex;
    align-items: center;
    > * {
      margin:3px;
      height: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      padding: 3px;
      border-radius: 4px;
      min-width: 16px;
      color: white;
    }
    > .rule-executions {
      background: #009688;
    }
    > .saga-yields {
      background: #673ab7;
    }
  }
`