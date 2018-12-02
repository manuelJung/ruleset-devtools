// @flow

export type Position = 'INSERT_BEFORE' | 'INSERT_INSTEAD' | 'INSERT_AFTER'

export type LogicAdd = 'ADD_RULE' | 'ABORT' | 'REAPPLY_WHEN'

export type LogicRemove = 'REAPPLY_WHEN' | 'REMOVE_RULE' | 'REAPPLY_REMOVE' | 'ABORT'

export type Rule = {
  id: string,
  target: '*' | string | string[],
  position: Position,
  zIndex?: number,
  condition?: string,
  consequence: string,
  addOnce?: boolean,
  addWhen?: string,
  addUntil?: string,
}