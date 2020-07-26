let input = [
  {
    "type": "REGISTER_RULE",
    "timestamp": 1592949924926,
    "rule": {
      "id": "snackbar/REMOVE_MESSAGE_AFTER_TIME",
      "target": "snackbar/ADD_MESSAGE",
      "output": "snackbar/REMOVE_MESSAGE",
      "delay": 3000,
      "consequence": "function consequence(action) {\n    return _actions__WEBPACK_IMPORTED_MODULE_2__[\"removeMessage\"](action.payload);\n  }"
    },
    "parentRuleId": null
  },
  {
    "type": "ADD_RULE",
    "timestamp": 1592949924926,
    "ruleId": "snackbar/REMOVE_MESSAGE_AFTER_TIME",
    "parentRuleId": null
  },
  {
    "type": "REGISTER_RULE",
    "timestamp": 1592949924954,
    "rule": {
      "id": "listing/TRIGGER_FETCH",
      "target": [
        "listing/INIT"
      ],
      "output": "listing/FETCH_REQUEST",
      "consequence": "function consequence(action) {\n    return _actions__WEBPACK_IMPORTED_MODULE_3__[\"fetchRequest\"](action.payload);\n  }"
    },
    "parentRuleId": null
  },
  {
    "type": "ADD_RULE",
    "timestamp": 1592949924954,
    "ruleId": "listing/TRIGGER_FETCH",
    "parentRuleId": null
  },
  {
    "type": "REGISTER_RULE",
    "timestamp": 1592949924954,
    "rule": {
      "id": "listing/FETCH",
      "target": "listing/FETCH_REQUEST",
      "output": [
        "listing/FETCH_FAILURE",
        "listing/FETCH_SUCCESS"
      ],
      "concurrency": "SWITCH",
      "consequence": "function consequence(action) {\n    var filterValues = action.meta.filterValues;\n    return _utils_api__WEBPACK_IMPORTED_MODULE_5__[\"fetch\"](filterValues).then(function (result) {\n      return _actions__WEBPACK_IMPORTED_MODULE_3__[\"fetchSuccess\"](filterValues, result);\n    }, function (error) {\n      return _actions__WEBPACK_IMPORTED_MODULE_3__[\"fetchFailure\"](filterValues, error.toString());\n    });\n  }"
    },
    "parentRuleId": null
  },
  {
    "type": "ADD_RULE",
    "timestamp": 1592949924954,
    "ruleId": "listing/FETCH",
    "parentRuleId": null
  },
  {
    "type": "REGISTER_RULE",
    "timestamp": 1592949924957,
    "rule": {
      "id": "cart/INITIAL_FETCH",
      "target": "*",
      "output": "cart/SET",
      "addOnce": true,
      "consequence": "function consequence() {\n    return _utils_api__WEBPACK_IMPORTED_MODULE_5__[\"fetch\"]().then(function (result) {\n      return result.items.length ? _actions__WEBPACK_IMPORTED_MODULE_4__[\"set\"](result) : null;\n    }, function (error) {\n      return null;\n    });\n  }"
    },
    "parentRuleId": null
  },
  {
    "type": "ADD_RULE",
    "timestamp": 1592949924957,
    "ruleId": "cart/INITIAL_FETCH",
    "parentRuleId": null
  },
  {
    "type": "REGISTER_RULE",
    "timestamp": 1592949924957,
    "rule": {
      "id": "cart/ADD_ITEM",
      "target": "cart/ADD_ITEM_REQUEST",
      "output": [
        "cart/ADD_ITEM_SUCCESS",
        "cart/ADD_ITEM_FAILURE"
      ],
      "concurrency": "SWITCH",
      "consequence": "function consequence(action) {\n    return _utils_api__WEBPACK_IMPORTED_MODULE_5__[\"addItem\"](action.meta.rawItem).then(function (result) {\n      return _actions__WEBPACK_IMPORTED_MODULE_4__[\"addItemSuccess\"](action.meta.rawItem, result);\n    }, function (error) {\n      return _actions__WEBPACK_IMPORTED_MODULE_4__[\"addItemFailure\"](action.meta.rawItem, error.toString());\n    });\n  }"
    },
    "parentRuleId": null
  },
  {
    "type": "ADD_RULE",
    "timestamp": 1592949924957,
    "ruleId": "cart/ADD_ITEM",
    "parentRuleId": null
  },
  {
    "type": "REGISTER_RULE",
    "timestamp": 1592949924957,
    "rule": {
      "id": "cart/REMOVE_ITEM",
      "target": "cart/REMOVE_ITEM_REQUEST",
      "output": [
        "cart/REMOVE_ITEM_SUCCESS",
        "cart/REMOVE_ITEM_FAILURE"
      ],
      "concurrency": "FIRST",
      "consequence": "function consequence(action) {\n    return _utils_api__WEBPACK_IMPORTED_MODULE_5__[\"removeItem\"](action.meta.item).then(function (result) {\n      return _actions__WEBPACK_IMPORTED_MODULE_4__[\"removeItemSuccess\"](action.meta.item, result);\n    }, function (error) {\n      return _actions__WEBPACK_IMPORTED_MODULE_4__[\"removeItemFailure\"](action.meta.item, error.toString());\n    });\n  }"
    },
    "parentRuleId": null
  },
  {
    "type": "ADD_RULE",
    "timestamp": 1592949924957,
    "ruleId": "cart/REMOVE_ITEM",
    "parentRuleId": null
  },
  {
    "type": "REGISTER_RULE",
    "timestamp": 1592949924957,
    "rule": {
      "id": "cart/UPDATE_ITEM",
      "target": "cart/UPDATE_ITEM_REQUEST",
      "output": [
        "cart/UPDATE_ITEM_SUCCESS",
        "cart/UPDATE_ITEM_FAILURE"
      ],
      "concurrency": "LAST",
      "consequence": "function consequence(action) {\n    var _action$meta = action.meta,\n        item = _action$meta.item,\n        amount = _action$meta.amount;\n    return _utils_api__WEBPACK_IMPORTED_MODULE_5__[\"updateItem\"](item, amount).then(function (result) {\n      return _actions__WEBPACK_IMPORTED_MODULE_4__[\"updateItemSuccess\"](item, amount, result);\n    }, function (error) {\n      return _actions__WEBPACK_IMPORTED_MODULE_4__[\"updateItemFailure\"](item, amount, error.toString());\n    });\n  }"
    },
    "parentRuleId": null
  },
  {
    "type": "ADD_RULE",
    "timestamp": 1592949924957,
    "ruleId": "cart/UPDATE_ITEM",
    "parentRuleId": null
  },
  {
    "type": "EXEC_ACTION_START",
    "timestamp": 1592949925057,
    "actionExecId": 1,
    "ruleExecId": null,
    "action": {
      "type": "navigation/LOCATION_CHANGED",
      "meta": {
        "prevLocation": null
      },
      "payload": {
        "pathname": "/",
        "search": "",
        "hash": "",
        "href": "http://localhost:8000/",
        "origin": "http://localhost:8000",
        "protocol": "http:",
        "host": "localhost:8000",
        "hostname": "localhost",
        "port": "8000",
        "state": null,
        "key": "initial"
      }
    }
  },
  {
    "type": "DISPATCH_ACTION",
    "timestamp": 1592949925057,
    "actionExecId": 1,
    "removed": false,
    "isReduxAction": true,
    "action": {
      "type": "navigation/LOCATION_CHANGED",
      "meta": {
        "prevLocation": null
      },
      "payload": {
        "pathname": "/",
        "search": "",
        "hash": "",
        "href": "http://localhost:8000/",
        "origin": "http://localhost:8000",
        "protocol": "http:",
        "host": "localhost:8000",
        "hostname": "localhost",
        "port": "8000",
        "state": null,
        "key": "initial"
      }
    }
  },
  {
    "type": "EXEC_RULE_START",
    "timestamp": 1592949925058,
    "ruleExecId": 1,
    "ruleId": "cart/INITIAL_FETCH",
    "actionExecId": 1,
    "concurrencyFilter": "default"
  },
  {
    "type": "EXEC_ACTION_END",
    "timestamp": 1592949925059,
    "actionExecId": 1,
    "ruleExecId": null,
    "action": {
      "type": "navigation/LOCATION_CHANGED",
      "meta": {
        "prevLocation": null
      },
      "payload": {
        "pathname": "/",
        "search": "",
        "hash": "",
        "href": "http://localhost:8000/",
        "origin": "http://localhost:8000",
        "protocol": "http:",
        "host": "localhost:8000",
        "hostname": "localhost",
        "port": "8000",
        "state": null,
        "key": "initial"
      }
    },
    "result": "DISPATCHED"
  },
  {
    "type": "EXEC_ACTION_START",
    "timestamp": 1592949925201,
    "actionExecId": 2,
    "ruleExecId": null,
    "action": {
      "type": "listing/INIT",
      "payload": {
        "query": "hello world",
        "page": 10
      }
    }
  },
  {
    "type": "DISPATCH_ACTION",
    "timestamp": 1592949925201,
    "actionExecId": 2,
    "removed": false,
    "isReduxAction": true,
    "action": {
      "type": "listing/INIT",
      "payload": {
        "query": "hello world",
        "page": 10
      }
    }
  },
  {
    "type": "EXEC_RULE_START",
    "timestamp": 1592949925202,
    "ruleExecId": 2,
    "ruleId": "listing/TRIGGER_FETCH",
    "actionExecId": 2,
    "concurrencyFilter": "default"
  },
  {
    "type": "EXEC_ACTION_START",
    "timestamp": 1592949925202,
    "actionExecId": 3,
    "ruleExecId": 2,
    "action": {
      "type": "listing/FETCH_REQUEST",
      "meta": {
        "filterValues": {
          "query": "hello world",
          "page": 10
        }
      }
    }
  },
  {
    "type": "DISPATCH_ACTION",
    "timestamp": 1592949925202,
    "actionExecId": 3,
    "removed": false,
    "isReduxAction": true,
    "action": {
      "type": "listing/FETCH_REQUEST",
      "meta": {
        "filterValues": {
          "query": "hello world",
          "page": 10
        }
      }
    }
  },
  {
    "type": "EXEC_RULE_START",
    "timestamp": 1592949925202,
    "ruleExecId": 3,
    "ruleId": "listing/FETCH",
    "actionExecId": 3,
    "concurrencyFilter": "default"
  },
  {
    "type": "EXEC_ACTION_END",
    "timestamp": 1592949925204,
    "actionExecId": 3,
    "ruleExecId": 2,
    "action": {
      "type": "listing/FETCH_REQUEST",
      "meta": {
        "filterValues": {
          "query": "hello world",
          "page": 10
        }
      }
    },
    "result": "DISPATCHED"
  },
  {
    "type": "EXEC_RULE_END",
    "timestamp": 1592949925204,
    "ruleExecId": 2,
    "ruleId": "listing/TRIGGER_FETCH",
    "actionExecId": 2,
    "concurrencyFilter": "default",
    "result": "RESOLVED"
  },
  {
    "type": "EXEC_ACTION_END",
    "timestamp": 1592949925204,
    "actionExecId": 2,
    "ruleExecId": null,
    "action": {
      "type": "listing/INIT",
      "payload": {
        "query": "hello world",
        "page": 10
      }
    },
    "result": "DISPATCHED"
  },
  {
    "type": "EXEC_ACTION_START",
    "timestamp": 1592949925327,
    "actionExecId": 4,
    "ruleExecId": 3,
    "action": {
      "type": "listing/FETCH_SUCCESS",
      "meta": {
        "filterValues": {
          "query": "hello world",
          "page": 10
        }
      },
      "payload": []
    }
  },
  {
    "type": "DISPATCH_ACTION",
    "timestamp": 1592949925328,
    "actionExecId": 4,
    "removed": false,
    "isReduxAction": true,
    "action": {
      "type": "listing/FETCH_SUCCESS",
      "meta": {
        "filterValues": {
          "query": "hello world",
          "page": 10
        }
      },
      "payload": []
    }
  },
  {
    "type": "EXEC_ACTION_END",
    "timestamp": 1592949925329,
    "actionExecId": 4,
    "ruleExecId": 3,
    "action": {
      "type": "listing/FETCH_SUCCESS",
      "meta": {
        "filterValues": {
          "query": "hello world",
          "page": 10
        }
      },
      "payload": []
    },
    "result": "DISPATCHED"
  },
  {
    "type": "EXEC_RULE_END",
    "timestamp": 1592949925329,
    "ruleExecId": 3,
    "ruleId": "listing/FETCH",
    "actionExecId": 3,
    "concurrencyFilter": "default",
    "result": "RESOLVED"
  },
  {
    "type": "EXEC_ACTION_START",
    "timestamp": 1592949926185,
    "actionExecId": 5,
    "ruleExecId": 1,
    "action": {
      "type": "cart/SET",
      "payload": {
        "items": [
          {
            "name": "Teller flach Straßburg",
            "sku": "10012563",
            "quantity": 1,
            "price": 11.94,
            "category": "Start",
            "brand": "Vega"
          }
        ],
        "subtotal": 11.94
      }
    }
  },
  {
    "type": "DISPATCH_ACTION",
    "timestamp": 1592949926185,
    "actionExecId": 5,
    "removed": false,
    "isReduxAction": true,
    "action": {
      "type": "cart/SET",
      "payload": {
        "items": [
          {
            "name": "Teller flach Straßburg",
            "sku": "10012563",
            "quantity": 1,
            "price": 11.94,
            "category": "Start",
            "brand": "Vega"
          }
        ],
        "subtotal": 11.94
      }
    }
  },
  {
    "type": "EXEC_ACTION_END",
    "timestamp": 1592949926190,
    "actionExecId": 5,
    "ruleExecId": 1,
    "action": {
      "type": "cart/SET",
      "payload": {
        "items": [
          {
            "name": "Teller flach Straßburg",
            "sku": "10012563",
            "quantity": 1,
            "price": 11.94,
            "category": "Start",
            "brand": "Vega"
          }
        ],
        "subtotal": 11.94
      }
    },
    "result": "DISPATCHED"
  },
  {
    "type": "EXEC_RULE_END",
    "timestamp": 1592949926190,
    "ruleExecId": 1,
    "ruleId": "cart/INITIAL_FETCH",
    "actionExecId": 1,
    "concurrencyFilter": "default",
    "result": "RESOLVED"
  },
  {
    "type": "REMOVE_RULE",
    "timestamp": 1592949926190,
    "ruleId": "cart/INITIAL_FETCH",
    "removedByParent": false
  }
]

function toArray (target) {
  let result;
  if(!target) result = []
  else if(typeof target === 'string') result = [target]
  else result = target
  return result//.map(s => s.split('/').join('_').replace('#', '').replace('-', '_'))
}

let rules = input
  .filter(o => o.type === 'REGISTER_RULE')
  .map(o => ({
    id: o.rule.id,
    namespace: o.rule.id[0] === '#' ? 'no-action' : o.rule.id.split('/')[0],
    target: toArray(o.rule.target),
    output: toArray(o.rule.output)
  }))
  // .filter(r => ['feature'].includes(r.namespace))

const temp = {}
rules.forEach(r => temp[r.id] = r)
rules = Object.values(temp)

const actions = Array.from(new Set(rules.reduce((p,n) => {
  return [...p, ...n.target, ...n.output]
}, [])))

let namespaces = {}
rules.forEach(r => {
  if(!namespaces[r.namespace]) namespaces[r.namespace] = []
  namespaces[r.namespace].push(r.id)
})
/**
${Object.entries(namespaces).map(([name,list],i) => `
  subgraph cluster_${i} {
    style=filled;
    color=lightgrey;
    node [style=filled,color=white];
    ${list.map(s => `"${s}";`).join('')}
    label = "${name}";
  }
  `).join('\n')}
 */

const g = `

  ${rules.map(rule => `
    ${rule.target.map(s => `"${s}" -> "${rule.id}";`).join('')}
    ${rule.output.map(s => `"${rule.id}" -> "${s}";`).join('')}
  `).join('\n')}

  ${actions.map(s => `"${s}" [color=blue];`).join('\n')}
`

console.log(`
  digraph G {
    ${g}
  }
`)
