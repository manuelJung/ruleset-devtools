// @flow
export function push <Item>(list:Item[]|void, item:Item):Item[]{
  if(!list) list = []
  list.push(item)
  return list
}