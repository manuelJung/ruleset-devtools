// @flow
import * as React from 'react'
import styled from 'styled-components'
import rootStore from 'stores/root'
import router from 'stores/router'
import {useObserver} from 'mobx-react'
import * as t from 'stores/types'
import ActionJson from './ActionJson'
import Sagas from './Sagas'

type Props = {
  action: t.Action,
  actionExecution?: t.ActionExecution | null
}

export default function ActionList ({action,actionExecution}:Props) {
  const [tab, setTab] = React.useState('action')
  return (
    <Wrapper className='ActionContext'>
      <div className='tabs'>
        <Tab active={tab==='action'} onClick={() => setTab('action')}>Action</Tab>
        {actionExecution && <Tab active={tab==='sagas'} onClick={() => setTab('sagas')}>Saga-Yields</Tab>}
      </div>
      <div className='content'>
        {tab === 'action' && <ActionJson actionExecution={actionExecution}/>}
        {tab === 'sagas' && <Sagas actionExecution={actionExecution}/>}
      </div>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  background: rgb(39, 40, 34);
  padding-top: 10px;
  box-sizing: border-box;

  > .tabs {
    width: 100%;
    border-bottom: 1px solid whitesmoke;
    display: flex;
    height: 35px;
  }

  > .content {
    height: calc(100% - 50px);
  }
`

const Tab = styled.div`
  padding: 8px;
  color: whitesmoke;
  cursor: pointer;
  &:hover {background: whitesmoke;color:rgb(39, 40, 34);}
  font-weight: ${props => props.active ? 'bold' : 'normal'};
`