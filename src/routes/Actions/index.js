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
import ActionList from 'components/ActionList'

type Props = {}

const router = observable({
  route: 'action',
  setRoute: route => router.route = route
})


export default observer<Props>(function ActionLayout(){

  return (
    <Wrapper className='ActionLayout'>
      <ActionList
        onActionClick={store => uiStore.setActiveStore(store)}
        activeActionExecId={uiStore.activeStore && uiStore.activeStore.storeType === 'ACTION_EXECUTION' && uiStore.activeStore.id}
      />
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
