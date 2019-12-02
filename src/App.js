// @flow
import * as React from 'react'
import styled from 'styled-components'
import {useObserver} from 'mobx-react'
import 'stores/root'
import browser from 'stores/browser'
import useResizer from 'hooks/useResizer'
import ActionList from 'widgets/ActionList'
import Graph from 'widgets/Graph'
import router from 'stores/router'
import {FiChevronLeft, FiChevronRight} from 'react-icons/fi'

export default function App () {
  const [leftSize,refLeft] = useResizer(230)
  const [contextSize,refContext] = useResizer(500, 'y')

  return useObserver(() =>
    <Wrapper className='App'>
      <div className='header'>
        <div className='navigate' onClick={() => router.go(-1)}><FiChevronLeft/></div>
        <div className='current-route'></div>
        <div className='routes'></div>
        <div className='navigate' onClick={() => router.go(1)}><FiChevronRight/></div>
      </div>
      <div className='content'>
        <div className='left' style={{width:leftSize}}>
          <ActionList />
          <div className='resize-angle' ref={refLeft}/>
        </div>
        <div className='right'>
          <div className='header'>header</div>
          <div className='content' style={{width: `calc(100vw - ${leftSize}px)`}}>
            <Graph/>
          </div>
          <div className='context' style={{height:contextSize}}>
            context
            <div className='resize-angle' ref={refContext}/>
          </div>
        </div>
      </div>
    </Wrapper>
  )
}


const Wrapper = styled.div`

  > .header {
    display: flex;
    background: #4B5E67;
    height: 40px;
    > .navigate {
      padding: 10px;
      font-size: 20px;
      color: white;
      display: flex; align-items: center;
      &:hover {
        background: #607d8b;
        cursor: pointer;
        line-height: 0;
      }
    }
    > .current-route {
      flex:1;
      height: 100%;
      display: flex;
      align-items: center;
      color: white;
      font-size: 20px;
      margin-left: 40px;
    }
  }

  > .content {
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
      background: #4B5E67;
      display: flex;
      flex-direction: column;

      > .header {
        height: 80px;
        background: lightgrey;
      }

      > .content {
        flex: 1;
        overflow: auto;
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
  }
  
`