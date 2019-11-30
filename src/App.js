// @flow
import * as React from 'react'
import styled from 'styled-components'
import {useObserver} from 'mobx-react'
import 'stores/root'
import browser from 'stores/browser'
import useResizer from 'hooks/useResizer'
import ActionList from 'widgets/ActionList'

export default function App () {
  const [leftSize,refLeft] = useResizer(230)
  const [contextSize,refContext] = useResizer(500, 'y')

  return useObserver(() =>
    <Wrapper className='App'>
      <div className='left' style={{width:leftSize}}>
        <ActionList />
        <div className='resize-angle' ref={refLeft}/>
      </div>
      <div className='right'>
        <div className='header'>header</div>
        <div className='content'>content</div>
        <div className='context' style={{height:contextSize}}>
          context
          <div className='resize-angle' ref={refContext}/>
        </div>
      </div>
    </Wrapper>
  )
}


const Wrapper = styled.div`
  display: flex;
  
  > .left {
    height: 100vh;
    background: steelblue;
    position: relative;

    > .resize-angle {
      position: absolute;
      top: 0;
      bottom: 0;
      right: 0;
      width: 15px;

      &:hover {
        background: lightgrey;
        cursor: pointer;
        cursor: ew-resize;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0.5;
        &:after {
          content: "||"
        }
      }
    }
  }

  > .right {
    height: 100vh;
    flex: 1;
    background: tomato;
    display: flex;
    flex-direction: column;

    > .header {
      height: 80px;
      background: lightgrey;
    }

    > .content {
      flex: 1;
    }

    > .context {
      position: relative;
      background: lightblue;
      > .resize-angle {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 15px;

        &:hover {
          background: lightgrey;
          cursor: pointer;
          cursor: ns-resize;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0.5;
          &:after {
            content: "||";
            transform: rotate(90deg);
          }
        }
      }
    }
  }
`