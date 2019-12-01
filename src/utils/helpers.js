// @flow
// export function push <Item>(list:Item[]|void, item:Item):Item[]{
//   if(!list) list = []
//   list.push(item)
//   return list
// }

export function push (obj:any, key:string|number, item:any){
  if(!obj[key]) obj[key] = []
  obj[key].push(item)
}