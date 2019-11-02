// @flow
import * as React from 'react'
import {useObserver} from 'mobx-react'
import styled from 'styled-components'
import dataStore from 'modules/store'
import uiStore from 'modules/ui'
import type {ActionExecution} from 'modules/entities'

type Props = {
  onActionClick: (actionExecution:ActionExecution) => mixed,
  activeActionExecId: number | null | false
}

export default function ActionList(props:Props){
  const activeActionExecution = props.activeActionExecId ? dataStore._actionExecutions.byId[props.activeActionExecId] : null
  const [filter, setFilter] = React.useState('')
  const [inverseFilter, setInverseFilter] = React.useState(false)
  const list = React.useMemo(() =>  {
    if(!filter) return dataStore.list
    let regex = ''
    try{ regex = new RegExp(filter)} catch(e){}
    if(!regex) return dataStore.list
    return dataStore.list.filter(item => {
      if(item.type !== 'action') return true
      const actionExecution = dataStore._actionExecutions.byId[item.actionExecId]
      const type = actionExecution.action.type
      return inverseFilter ? !type.match(regex) : type.match(regex)
    })
  },[filter, inverseFilter])
  return useObserver(() => (
    <Wrapper className='ActionList' inverseFilter={inverseFilter}>
      <div className='filter'>
        <input type='text' value={filter} onChange={e => setFilter(e.target.value)} placeholder='regex'/>
        <button onClick={() => setInverseFilter(!inverseFilter)}>
          not
        </button>
      </div>
      <div className='list'>
        {list.map((item,i) => {
          switch(item.type){
            case 'action': {
              const actionExecution = dataStore._actionExecutions.byId[item.actionExecId]
              const resolved = actionExecution.dispatchedAction && !actionExecution.dispatchedAction.removed
              const active = activeActionExecution === actionExecution
              let related = false
              if(activeActionExecution){
                related = Boolean(activeActionExecution.relatedActionExecutionsDict[actionExecution.id])
                      || Boolean(actionExecution.relatedActionExecutionsDict[activeActionExecution.id])
              }
              const handleClick = () => props.onActionClick(actionExecution)
              return (
                <Action key={i} active={active} resolved={resolved} related={related} onClick={handleClick}>
                  {actionExecution.action.type}
                  {!!actionExecution.assignedRuleExecutions.length && <span className='info num-rules'>{actionExecution.assignedRuleExecutions.length}</span>}
                  {!!actionExecution.assignedSagaYields.length && <span className='info num-sagas'>{actionExecution.assignedSagaYields.length}</span>}
                </Action>
              )
            }
            case 'rules': {
              return (
                <Rules key={i}>
                  {!!item.added.length && <span>added: {item.added.length}</span>}
                  {!!item.added.length && !!item.removed.length && <span> -- </span>}
                  {!!item.removed.length && <span>removed: {item.removed.length}</span>}
                </Rules>
              )
            }
            default: return null
          }
        })}
      </div>
    </Wrapper>
  ))
}


const Wrapper = styled.section`
  height: 100%;

  > .filter {
    height: 50px;
    background: #51626A;
    padding: 5px;

    > input {
      background: none;
      border: none;
      color: white;
      font-weight: bold;
      font-size: 30px;
      outline: none;
    }

    > button {
      padding: 8px;
      border: 2px solid white;
      color: white;
      cursor: pointer;
      &:focus {outline:none;}

      background: ${props => props.inverseFilter ? 'grey' : 'none'};
    }
  }

  > .list {
    flex: 1;
    height: 100%;
    min-width: 250px;
    overflow-y: scroll;
  }
`

const Action = styled.div`
  position: relative;
  padding: 15px 10px;
  border: 1px solid whitesmoke;
  background: ${props => props.active ? 'green' : props.related ? '#607d8b' : props.resolved ? '#52626a' : '#a31948'};
  color: #e8f1f5;

  > .info {
    position: absolute;
    right: 5px;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 20px;
  }

  > .num-rules {
    top: 5px;
    background: #009688;
  }

  > .num-sagas {
    bottom: 5px;
    background: #673ab7;
  }
`

const Rules = styled.div`
  padding: 10px;
  border: 1px solid whitesmoke;
  background: #607d8bb3;
`