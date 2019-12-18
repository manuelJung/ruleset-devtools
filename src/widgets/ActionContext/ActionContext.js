// @flow
import * as React from 'react'
import styled from 'styled-components'
import rootStore from 'stores/root'
import router from 'stores/router'
import {useObserver} from 'mobx-react'
import * as t from 'stores/types'

type Props = {
  action: t.Action,
  actionExecution?: t.ActionExecution
}

export default function ActionList ({action,actionExecution}:Props) {
  const [tab, setTab] = React.useState('action')
  return (
    <Wrapper className='ActionContext'>
      <div className='tabs'>
        <Tab active={tab==='action'} onClick={() => setTab('action')}>Action</Tab>
        <Tab active={tab==='sagas'} onClick={() => setTab('sagas')}>Sagas</Tab>
      </div>
      <div className='content'>
        {tab}
      </div>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  background: #607d8b;
  padding-top: 10px;

  > .tabs {
    width: 100%;
    border-bottom: 1px solid whitesmoke;
    display: flex;
  }
`

const Tab = styled.div`
  padding: 8px;
  color: whitesmoke;
  cursor: pointer;
  &:hover {background: whitesmoke;color:#607d8b;}
  font-weight: ${props => props.active ? 'bold' : 'normal'};
`