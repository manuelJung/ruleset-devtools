// @flow
import * as React from 'react'
import styled from 'styled-components'
import {useObserver} from 'mobx-react'
import 'stores/root'

export default function App () {
  return useObserver(() =>
    <Wrapper className='App'>
      <div className='left-panel-wrapper'>left</div>
      <div className='top-panel-wrapper'>top</div>
      <div className='content-panel-wrapper'>content</div>
      <div className='context-panel-wrapper'>context</div>
    </Wrapper>
  )
}

const Wrapper = styled.div``