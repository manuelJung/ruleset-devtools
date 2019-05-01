
if(window.__getRulesetEvents) window.postMessage({
  isRulesetMessage: true,
  type: 'UPDATE_RULESET_EVENTS',
  events: JSON.parse(JSON.stringify(window.__getRulesetEvents(), null, 2)),
},'*')
