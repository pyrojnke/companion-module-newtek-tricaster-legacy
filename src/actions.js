const net = require('net')

function escapeXmlAttribute(value) {
	return String(value)
		.replace(/&/g, '&amp;')
		.replace(/'/g, '&apos;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
}

module.exports = {
	initActions() {
		const self = this

		self.setActionDefinitions({
			sendShortcutCommand: {
				name: 'Send Shortcut Command',
				description: 'Send a legacy shortcut command directly to the TriCaster on TCP port 5951.',
				options: [
					{
						type: 'textinput',
						label: 'Shortcut Name',
						id: 'shortcutName',
						default: '',
					},
					{
						type: 'textinput',
						label: 'Value',
						id: 'value',
						default: '',
					},
					{
						type: 'static-text',
						id: 'valueHelp',
						label: 'Value Note',
						value: 'Leave Value blank for shortcut commands that do not require a value, such as main_auto.',
					},
				],
				callback: async (action) => {
					const shortcutName = String(action.options.shortcutName || '').trim()
					const value = String(action.options.value ?? '').trim()

					if (!shortcutName) {
						self.log('warn', 'Shortcut command not sent because Shortcut Name is blank.')
						return
					}

					self.sendShortcutCommand(shortcutName, value)
				},
			},
		})
	},

	sendShortcutCommand(shortcutName, value) {
		if (!this.config.host) {
			this.log('warn', 'Shortcut command not sent because the TriCaster IP address is not configured.')
			return
		}

		const escapedShortcutName = escapeXmlAttribute(shortcutName)
		const escapedValue = escapeXmlAttribute(value)

		const command =
			value === ''
				? `<shortcut name='${escapedShortcutName}' />\n`
				: `<shortcut name='${escapedShortcutName}' value='${escapedValue}' />\n`

		const commandSocket = net.createConnection({
			host: this.config.host,
			port: 5951,
		})

		commandSocket.on('connect', () => {
			if (this.config.verbose) {
				this.log('debug', `Sending shortcut command: ${command.trim()}`)
			}

			commandSocket.end(command)
		})

		commandSocket.on('error', (error) => {
			this.log('error', `Shortcut command connection error: ${error.message}`)
			commandSocket.destroy()
		})
	},
}