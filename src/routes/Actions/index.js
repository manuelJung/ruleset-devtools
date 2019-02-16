// @flow
import React from 'react'
import {observer} from 'mobx-react'
import styled from 'styled-components'
import dataStore from 'modules/store'
import {observable} from 'mobx'

import RulesRoute from './routes/Rules'

function flatten(arr) {
  return arr.reduce(function (flat, toFlatten) {
    return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
  }, []);
}

type State = {
  activeActionExecId: number | null,
  relatedActionExecIds: {[actionExecId:number]:number},
  setRelatedActionExecIds: (numbers:number[]) => void
}

const state:State = observable(({
  activeActionExecId: null,
  relatedActionExecIds: {},
  setRelatedActionExecIds: numbers => {
    state.relatedActionExecIds = numbers.reduce((list,n) => (list[n]=n) && list, {})
  }
}:State))

type Props = {}

export default observer<Props>(function ActionLayout(){
  return (
    <Wrapper className='ActionLayout'>
      <div className='list'>
        {dataStore.list.map((item,i) => {
          switch(item.type){
            case 'action': return <Action key={i} actionExecId={item.actionExecId}/>
            case 'rules': return <Rules key={i} added={item.added} removed={item.removed}/>
            default: return <span key={i}/>
          }
        })}
      </div>
      <div className='content'>
        <RulesRoute actionExecId={state.activeActionExecId} />
      </div>
    </Wrapper>
  )
})

type ActionProps = {
  actionExecId: number
}

const Action = observer<ActionProps>(function Action(props:ActionProps){
  const store = dataStore._actionExecutions.byId[props.actionExecId]
  const resolved = store.dispatchedAction && !store.dispatchedAction.removed
  const active = state.activeActionExecId === store.id
  const related = !!state.relatedActionExecIds[store.id]
  const handleClick = () => {
    state.activeActionExecId = store.id
    const related = store.assignedRuleExecutions.map(store => store.actionExecutions.map(store =>  store.id))
    state.setRelatedActionExecIds(flatten(related))
  }
  return (
    <ActionWrapper active={active} resolved={resolved} related={related} onClick={handleClick}>
      {store.action.type}
      {!!store.assignedRuleExecutions.length && <span className='info num-rules'>{store.assignedRuleExecutions.length}</span>}
      {!!store.assignedSagaYields.length && <span className='info num-sagas'>{store.assignedSagaYields.length}</span>}
    </ActionWrapper>
  )
})

type RuleProps = {
  removed: string[],
  added: string[]
}

const Rules = observer<RuleProps>(function Rules(props:RuleProps){
  return (
    <RulesWrapper>
      {!!props.added.length && <span>added: {props.added.length}</span>}
      {!!props.added.length && !!props.removed.length && <span> -- </span>}
      {!!props.removed.length && <span>removed: {props.removed.length}</span>}
    </RulesWrapper>
  )
})

const Wrapper = styled.section`
  display: flex;
  height: 100%;

  > .list {
    flex: 1;
    height: 100%;
    overflow-y: scroll;
  }

  > .content {
    flex: 2;
    height: 100%;
    background: silver;
  }
`

const ActionWrapper = styled.div`
  position: relative;
  padding: 20px 10px;
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

const RulesWrapper = styled.div`
  padding: 10px;
  border: 1px solid whitesmoke;
  background: #607d8bb3;
`