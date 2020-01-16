// @flow
import * as React from 'react'
import styled from 'styled-components'
import rootStore from 'stores/root'
import router from 'stores/router'
import {useObserver} from 'mobx-react'
import * as t from 'stores/types'
import RuleData from './RuleData'
import RuleHistory from './RuleHistory'

type Props = {
  rule: t.Rule,
  ruleExecution?: t.RuleExecution | null
}

export default function RuleContext ({rule,ruleExecution}:Props) {
  const [tab, setTab] = React.useState('rule')
  return useObserver(() =>
    <Wrapper className='ActionContext'>
      <div className='tabs'>
        <Tab active={tab==='rule'} onClick={() => setTab('rule')}>Rule</Tab>
        <Tab active={tab==='history'} onClick={() => setTab('history')}>Rule-History</Tab>
      </div>
      <div className='title'>
        <span>{rule.id}</span>
      </div>
      <div className='content'>
        {tab === 'rule' && <RuleData rule={rule} ruleExecution={ruleExecution}/>}
        {tab === 'history' && <RuleHistory rule={rule} ruleExecution={ruleExecution}/>}
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

  > .title {
    font-size: 24px;
    color: whitesmoke;
    height: 45px;
    width: 100%;
    position: relative;
    > span {
      padding: 10px;
      overflow:hidden;
      text-overflow: ellipsis;
      position: absolute;
      left:0;
      right:0;
      bottom:0;
      top:0;
    }
  }

  > .content {
    overflow: auto;
    height: calc(100% - 91px);
  }
`

const Tab = styled.div`
  padding: 8px;
  color: whitesmoke;
  cursor: pointer;
  &:hover {background: whitesmoke;color:rgb(39, 40, 34);}
  font-weight: ${props => props.active ? 'bold' : 'normal'};
`