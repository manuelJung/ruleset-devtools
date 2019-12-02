// @flow
import * as React from 'react'
import styled from 'styled-components'
import rootStore from 'stores/root'
import {observer} from 'mobx-react'
import router from 'stores/router'

export default observer(function ActionList () {
  return (
    <Wrapper className='ActionList'>
      <div className='filter-wrapper'></div>
      <div className='list'>
        {rootStore.dispatchedActions.map(dispatchedAction => (
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
})

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  background: #4b5e67;
  overflow: scroll;
  
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