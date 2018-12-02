// @flow
import type {RuleExecution, Action} from './entities'
import type {DB} from './index'

export type State = {
  preActionExecutions: {ruleId:string, actionId:string}[],
  byId: {[id:string]: RuleExecution}
}

const defaultState = {
  preActionExecutions: [],
  byId: {}
}

export default function ruleExecutionReducer (state:State=defaultState, action:Action, db?:DB):State{
  if(!db) return state
  switch(action.type){
    case 'EXEC_RULE': {
      const preActions = state.preActionExecutions
      const rule = action.payload
      const {id, timestamp} = action.meta
      return {
        ...state,
        byId: {
          ...state.byId,
          [id]: {
            id: id,
            ruleId: rule.id,
            timestamp: timestamp,
            finished: preActions.find(o => o.ruleId === rule.id) ? true : false,
            actionExecutionIds: preActions.filter(o => o.ruleId === rule.id).map(o => o.actionId)
          }
        }
      }
    }

    case 'EXEC_ACTION': {
      const {ruleId, id} = action.meta
      if(!ruleId) return state
      if(!state.byId[ruleId]){
        return {
          ...state,
          preActionExecutions: [...state.preActionExecutions, {
            ruleId, actionId: id
          }]
        }
      }
      return {
        ...state,
        byId: {
          ...state.byId,
          [ruleId]: {
            ...state.byId[ruleId],
            actionExcutionIds: [...state.byId[ruleId].actionExecutionIds, id]
          }
        }
      }
    }
    
    default: return state
  }
}