// @flow
import React from 'react'
import {observer} from 'mobx-react'
import uiStore from 'modules/ui'

import type {RuleExecution} from 'modules/entities'

export default observer<{}>(function StoreDetails(){
  if(!uiStore.activeStore) return null
  switch(uiStore.activeStore.storeType){
    case 'RULE_EXECUTION': return <RuleExecutionDetails store={uiStore.activeStore} />
    case 'ACTION_EXECUTION': return <div/>
    case 'RULESET': return <div/>
    default: return <div/>
  }
})


const RuleExecutionDetails = observer<{store:RuleExecution}>(function RuleExecutionDetails({store}){
  return (
    <div className='RuleExecutionDetails'>
      {store.rule.id}
    </div>
  )
})