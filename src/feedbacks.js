module.exports = {
initFeedbacks() {
const self = this

self.setFeedbackDefinitions({
shortcutStateEquals: {
name: 'Shortcut State Equals',
description: 'Active when a TriCaster shortcut state equals the specified value.',
type: 'boolean',
defaultStyle: {
bgcolor: 0xff0000,
color: 0xffffff,
},
options: [
{
type: 'textinput',
label: 'State Name',
id: 'stateName',
default: '',
},
{
type: 'textinput',
label: 'Expected Value',
id: 'expectedValue',
default: '',
},
],
callback: (feedback) => {
const stateName = String(feedback.options.stateName || '').trim()
const expectedValue = String(feedback.options.expectedValue ?? '')

if (!stateName) {
return false
}

return String(self.shortcutStates[stateName] ?? '') === expectedValue
},
},
})
},
}
