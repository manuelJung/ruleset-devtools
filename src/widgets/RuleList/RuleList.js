// @flow
import * as React from 'react'
import styled from 'styled-components'
import rootStore from 'stores/root'
import {useLocalStore,  observer} from 'mobx-react'
import router from 'stores/router'

export default observer(function RuleList () {
  let state = useLocalStore(() => ({search:''}))

  return (
    <Wrapper className='RuleList'>
      <form className='search-form'>
        <input type='text' value={state.search} onChange={e => (state.search=e.target.value)} placeholder='filter...'/>
      </form>
      <div className='rule-list'>
        {rootStore.rules.filter(rule => rule.id.includes(state.search)).map(rule => (
          <div className='rule' key={rule.id} onClick={() => router.push({
            type: 'GRAPH',
            store: rule
          })}>{rule.id}</div>
        ))}
      </div>
    </Wrapper>
  )
})

const Wrapper = styled.div`
  > .search-form {
    width: 100%;
    padding: 10px;
    
    > input {
      width: 100%;
      background: none;
      border: none;
      color: whitesmoke;
      font-size: 18px;
      border-bottom: 1px solid lightgrey;
      padding-bottom: 6px;
      &:focus{outline:none;}
      &::placeholder{color: whitesmoke;}
    }
  }

  > .rule-list {
    display: flex;
    flex-wrap: wrap;
    > .rule {
      margin: 10px;
      width: calc(50% - 40px);
      padding: 8px;
      border: 1px solid whitesmoke;
      color: whitesmoke;
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
`