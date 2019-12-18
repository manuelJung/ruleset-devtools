// @flow
import * as React from 'react'
import styled from 'styled-components'
import rootStore from 'stores/root'
import router from 'stores/router'
import {useObserver} from 'mobx-react'

export default function ActionList () {
  const [commitIndex, setCommitIndex] = React.useState(0)
  const [filter, setFilter] = React.useState('')

  return useObserver(() =>
    <Wrapper className='ActionList'>
      <div className='filter-wrapper'>
        <input type='text' placeholder='filter...' value={filter} onChange={e => setFilter(e.target.value)}/>
        <button onClick={() => setCommitIndex(rootStore.dispatchedActions.length)}>commit</button>
      </div>
      <div className='list'>
        {rootStore.dispatchedActions
          .slice(commitIndex)
          .filter(dispatchedAction => filter ? dispatchedAction.data.type.includes(filter) : true)
          .map(dispatchedAction => (
          <div className='item' key={dispatchedAction.id} onClick={() => router.push({
            type: 'GRAPH',
            store: dispatchedAction.actionExecution.action,
            actionExecution: dispatchedAction.actionExecution
          })}>
            <div className='label'>{dispatchedAction.data.type}</div>
            <div className='badges'>
              {!!dispatchedAction.assignedRuleExecutions.length && (
                <div className='rule-executions'>{dispatchedAction.assignedRuleExecutions.length}</div>
              )}
              {!!dispatchedAction.sagaYields.length && (
                <div className='saga-yields'>{dispatchedAction.sagaYields.length}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  background: #4b5e67;
  overflow: scroll;

  > .filter-wrapper {
    display: flex;
    padding: 5px;
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
    padding-bottom: 100px;
    > .item {
      display: flex;
      border-top: 1px solid #9e9e9e;
      &:hover {
        background: #607d8b;
        cursor: pointer;
      }
    }
    > .item > .label {
      flex: 1;
      padding: 8px;
      overflow: hidden;
      text-overflow: ellipsis;
      color: #e2e0e0;
      font-size: 14px;
    }

    > .item > .badges {
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

  }
`