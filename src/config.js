const { Regex } = require('@companion-module/base')

module.exports = {
getConfigFields() {
return [
{
type: 'static-text',
id: 'info',
width: 12,
label: 'Information',
value:
'Connects to legacy NewTek TriCaster systems using the TCP 5951 NTK_states protocol for live switcher state feedback.',
},
{
type: 'textinput',
id: 'host',
label: 'TriCaster IP Address',
width: 6,
regex: Regex.IP,
default: '',
},
{
type: 'checkbox',
id: 'verbose',
label: 'Enable Verbose Logging',
width: 3,
default: false,
},
{
type: 'static-text',
id: 'verboseInfo',
width: 9,
label: ' ',
value:
'Verbose logging displays raw state data received from the TriCaster. Use primarily for testing and troubleshooting.',
},
]
},
}
