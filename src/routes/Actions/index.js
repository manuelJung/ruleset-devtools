// @flow
import React from 'react'
import {observer} from 'mobx-react'
import styled from 'styled-components'
import dataStore from 'modules/store'

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
      <div className='content'></div>
    </Wrapper>
  )
})

type ActionProps = {
  actionExecId: number
}

const Action = observer<ActionProps>(function Action(props:ActionProps){
  const store = dataStore._actionExecutions.byId[props.actionExecId]
  return (
    <ActionWrapper>
      {store.action.type}
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
      added: {props.added.length} -- removed: {props.removed.length}
    </RulesWrapper>
  )
})

const Wrapper = styled.section`
  display: flex;
  height: 100%;

  > .list {
    flex: 1;
    height: 100%;
    background: steelblue;
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
  background: #607d8b;
  color: #e8f1f5;
`

const RulesWrapper = styled.div`
  padding: 10px;
  border: 1px solid whitesmoke;
  background: #607d8bb3;
`