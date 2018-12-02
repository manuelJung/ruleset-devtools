// @flow
import type {ActionExecution, Action} from './entities'
import type {DB} from './index'

export type State = {
  byId: {[id:string]: ActionExecution}
}

const defaultState = {
  byId: {}
}

export default function actionExecutionReducer (state:State=defaultState, action:Action, db?:DB):State{
  if(!db) return state
  switch(action.type){
    case 'EXEC_ACTION': {
      const {id, ruleId} = action.meta
      return {
        ...state,
        byId: {
          ...state.byId,
          [id]: { id, ruleId,  }
        }
      }
    }
    
    default: return state
  }
}