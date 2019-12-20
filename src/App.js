// @flow
import * as React from 'react'
import styled from 'styled-components'
import {useObserver} from 'mobx-react'
import 'stores/root'
import browser from 'stores/browser'
import useResizer from 'hooks/useResizer'
import ActionList from 'widgets/ActionList'
import Graph from 'widgets/Graph'
import RuleList from 'widgets/RuleList'
import ActionContext from 'widgets/ActionContext'
import RuleContext from 'widgets/RuleContext'
import router from 'stores/router'
import {FiChevronLeft, FiChevronRight} from 'react-icons/fi'

export default function App () {
  const [leftSize,refLeft] = useResizer(230)
  const [contextSize,refContext] = useResizer(500, 'y')

  let routeLabel = ''

  if(router.route.type === 'GRAPH'){
    if(router.route.store.storeType === 'ACTION'){
      routeLabel = 'Action > '+router.route.store.type
    }
    if(router.route.store.storeType === 'RULE'){
      routeLabel = 'Rule > '+router.route.store.id
    }
  }
  if(router.route.type === 'RULE_LIST'){
    routeLabel = 'Rule List'
  }

  return useObserver(() =>
    <Wrapper className='App'>
      <div className='header'>
        <div className='navigate' onClick={() => router.go(-1)}><FiChevronLeft/></div>
        <div className='current-route'>{routeLabel}</div>
        <div className='routes'>
          <button onClick={() => router.push({
            type: 'RULE_LIST'
          })}>Rules</button>
        </div>
        <div className='navigate' onClick={() => router.go(1)}><FiChevronRight/></div>
      </div>
      <div className='content'>
        <div className='left' style={{width:leftSize}}>
          <ActionList />
          <div className='resize-angle' ref={refLeft}/>
        </div>
        <div className='right'>
          {/* <div className='header'>header</div> */}
          <div className='content' style={{width: `calc(100vw - ${leftSize}px)`}}>
            {router.route.type === 'GRAPH' && <Graph/>}
            {router.route.type === 'RULE_LIST' && <RuleList/>}
          </div>
            <div className='context' style={{height:contextSize, display:router.route.type === 'GRAPH'?'block':'none'}}>
              {router.route.type === 'GRAPH' && router.route.store.storeType === 'ACTION' && (
                <ActionContext
                  action={router.route.store}
                  actionExecution={router.route.actionExecution}
                />
              )}
              {router.route.type === 'GRAPH' && router.route.store.storeType === 'RULE' && (
                <RuleContext
                  rule={router.route.store}
                  ruleExecution={router.route.ruleExecution}
                />
              )}
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
    background: rgb(39, 40, 34);
    height: 45px;
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
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-right: 10px;
    }
    > .routes {
      height: 100%;
      display: flex;
      align-items: center;
      > button {
        padding: 6px;
        background: none;
        color: whitesmoke;
        font-size: 14px;
        cursor: pointer;
        border: 1px solid whitesmoke;
      }
    }
  }

  > .content {
    display: flex;
    > .left {
      height: 100vh;
      background: steelblue;
      position: relative;
      border-right: 1px solid grey;

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
      background: rgb(39, 40, 34);
      display: flex;
      flex-direction: column;
      border-top: 1px solid grey;

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
        background: rgb(39, 40, 34);
        box-shadow: 15px 8px 7px 10px #607d8b;
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