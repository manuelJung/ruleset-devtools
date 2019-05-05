// @flow
import * as React from 'react'
import {observer} from 'mobx-react'
import {observable} from 'mobx'
import styled from 'styled-components'
import dataStore from 'modules/store'
import uiStore from 'modules/ui'

import RulesRoute from './routes/Rules'
import ActionRoute from './routes/Action'
import SagaYieldsRoute from './routes/SagaYields'

type Props = {}

const router = observable({
  route: 'action',
  setRoute: route => router.route = route
})


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
        <div className='header'>
          <div className='link' onClick={() => router.setRoute('action')}>Action</div>
          <div className='link' onClick={() => router.setRoute('rules')}>Rules</div>
          <div className='link' onClick={() => router.setRoute('sagaYields')}>Sagas</div>
        </div>
        {uiStore.activeStore && uiStore.activeStore.storeType === 'ACTION_EXECUTION' && (
          <React.Fragment>
            {router.route === 'action' && <ActionRoute actionExecId={uiStore.activeStore.id} />}
            {router.route === 'rules' && <RulesRoute actionExecId={uiStore.activeStore.id} />}
            {router.route === 'sagaYields' && <SagaYieldsRoute actionExecId={uiStore.activeStore.id} />}
          </React.Fragment>
        )}
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
  const active = uiStore.activeStore === store
  let related = false
  if(uiStore.activeStore && uiStore.activeStore.storeType === 'ACTION_EXECUTION'){
    related = !!uiStore.activeStore.relatedActionExecutionsDict[store.id] 
    || !!store.relatedActionExecutionsDict[uiStore.activeStore.id]
  }
  const handleClick = () => uiStore.setActiveStore(store)
  return (
    <ActionWrapper active={active} resolved={resolved} related={related} onClick={handleClick}>
      {store.action.type}
      {!!store.assignedRuleExecutions.length && <span className='info num-rules'>{store.assignedRuleExecutions.length}</span>}
      {!!store.assignedSagaYields.length && <span className='info num-sagas'>{store.assignedSagaYields.length}</span>}
    </ActionWrapper>
  )
})

type RuleProps = {
  removed: *,
  added: *
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
    min-width: 250px;
    overflow-y: scroll;
  }

  > .content {
    flex: 2;
    height: 100%;
    background: silver;

    > .header {
      background: #52626a;
      display: flex;
      padding: 5px;
      > .link {
        margin: 5px;
        padding: 5px 10px;
        border: 2px solid white;
        color: white;
      }
    }
  }
`

const ActionWrapper = styled.div`
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

const RulesWrapper = styled.div`
  padding: 10px;
  border: 1px solid whitesmoke;
  background: #607d8bb3;
`