const net = require('net')

const SOURCE_CHOICES = [
	{ id: 'Input1', label: 'Input 1' },
	{ id: 'Input2', label: 'Input 2' },
	{ id: 'Input3', label: 'Input 3' },
	{ id: 'Input4', label: 'Input 4' },
	{ id: 'Input5', label: 'Input 5' },
	{ id: 'Input6', label: 'Input 6' },
	{ id: 'Input7', label: 'Input 7' },
	{ id: 'Input8', label: 'Input 8' },
	{ id: 'Net', label: 'NET 1' },
	{ id: 'Net2', label: 'NET 2' },
	{ id: 'DDR', label: 'DDR 1' },
	{ id: 'DDR2', label: 'DDR 2' },
	{ id: 'Stills', label: 'STILLS' },
	{ id: 'BFR1', label: 'FRAME BUFFER' },
	{ id: 'Titles', label: 'TITLES' },
	{ id: 'Black', label: 'BLACK' },
]

const ME_CHOICES = [
	{ id: '1', label: 'M/E 1' },
	{ id: '2', label: 'M/E 2' },
	{ id: '3', label: 'M/E 3' },
	{ id: '4', label: 'M/E 4' },
	{ id: '5', label: 'M/E 5' },
	{ id: '6', label: 'M/E 6' },
	{ id: '7', label: 'M/E 7' },
	{ id: '8', label: 'M/E 8' },
]

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
				name: 'Advanced: Send Shortcut Command',
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
			setProgramPreviewSource: {
				name: 'Program/Preview: Set Source',
				description: 'Set the selected source on the Main Program or Preview row.',
				options: [
					{
						type: 'dropdown',
						label: 'Destination',
						id: 'destination',
						default: 'program',
						choices: [
							{ id: 'program', label: 'Program' },
							{ id: 'preview', label: 'Preview' },
						],
					},
					{
						type: 'dropdown',
						label: 'Source',
						id: 'source',
						default: 'Input1',
						choices: SOURCE_CHOICES,
					},
				],
				callback: async (action) => {
					const shortcutName =
						action.options.destination === 'preview'
							? 'main_b_row_named_input'
							: 'main_a_row_named_input'

					self.sendShortcutCommand(shortcutName, action.options.source)
				},
			},
			programTransition: {
				name: 'Program: Transition',
				description: 'Perform a CUT or AUTO transition using the current Main transition delegation.',
				options: [
					{
						type: 'dropdown',
						label: 'Transition',
						id: 'transition',
						default: 'auto',
						choices: [
							{ id: 'auto', label: 'AUTO' },
							{ id: 'cut', label: 'CUT' },
						],
					},
				],
				callback: async (action) => {
					const shortcutName = action.options.transition === 'cut' ? 'main_take' : 'main_auto'

					self.sendShortcutCommand(shortcutName, '')
				},
			},
			programDskTransition: {
				name: 'Program DSK: Transition',
				description: 'Perform an AUTO or CUT transition on DSK 1 or DSK 2.',
				options: [
					{
						type: 'dropdown',
						label: 'DSK',
						id: 'dsk',
						default: 'dsk1',
						choices: [
							{ id: 'dsk1', label: 'DSK 1' },
							{ id: 'dsk2', label: 'DSK 2' },
						],
					},
					{
						type: 'dropdown',
						label: 'Transition',
						id: 'transition',
						default: 'auto',
						choices: [
							{ id: 'auto', label: 'AUTO' },
							{ id: 'cut', label: 'CUT' },
						],
					},
				],
				callback: async (action) => {
					const dsk = action.options.dsk === 'dsk2' ? 'dsk2' : 'dsk1'
					const transition = action.options.transition === 'cut' ? 'take' : 'auto'
					const shortcutName = `main_${dsk}_${transition}`

					self.sendShortcutCommand(shortcutName, '')
				},
			},
			setMeSource: {
				name: 'M/E: Set Source',
				description: 'Set the selected source on row A or B of the selected M/E.',
				options: [
					{
						type: 'dropdown',
						label: 'M/E',
						id: 'me',
						default: '1',
						choices: ME_CHOICES,
					},
					{
						type: 'dropdown',
						label: 'Row',
						id: 'row',
						default: 'a',
						choices: [
							{ id: 'a', label: 'A' },
							{ id: 'b', label: 'B' },
						],
					},
					{
						type: 'dropdown',
						label: 'Source',
						id: 'source',
						default: 'Input1',
						choices: SOURCE_CHOICES,
					},
				],
				callback: async (action) => {
					const me = String(action.options.me)
					const row = action.options.row === 'b' ? 'b' : 'a'
					const shortcutName = `v${me}_${row}_row_named_input`

					self.sendShortcutCommand(shortcutName, action.options.source)
				},
			},
			meDskTransition: {
				name: 'M/E DSK: Transition',
				description: 'Perform an AUTO or CUT transition on the DSK of the selected M/E.',
				options: [
					{
						type: 'dropdown',
						label: 'M/E',
						id: 'me',
						default: '1',
						choices: ME_CHOICES,
					},
					{
						type: 'dropdown',
						label: 'Transition',
						id: 'transition',
						default: 'auto',
						choices: [
							{ id: 'auto', label: 'AUTO' },
							{ id: 'cut', label: 'CUT' },
						],
					},
				],
				callback: async (action) => {
					const me = String(action.options.me)
					const transition = action.options.transition === 'cut' ? 'take' : 'auto'
					const shortcutName = `v${me}_dsk1_${transition}`

					self.sendShortcutCommand(shortcutName, '')
				},
			},
			setMeDskSource: {
				name: 'M/E DSK: Set Source',
				description: 'Set the DSK source of the selected M/E.',
				options: [
					{
						type: 'dropdown',
						label: 'M/E',
						id: 'me',
						default: '1',
						choices: ME_CHOICES,
					},
					{
						type: 'dropdown',
						label: 'Source',
						id: 'source',
						default: 'Input1',
						choices: SOURCE_CHOICES,
					},
				],
				callback: async (action) => {
					const me = String(action.options.me)
					const shortcutName = `v${me}_dsk1_select_named_input`

					self.sendShortcutCommand(shortcutName, action.options.source)
				},
			},
			setOutput2Source: {
				name: 'Output 2: Set Source',
				description: 'Set the source routed to TriCaster Output 2.',
				options: [
					{
						type: 'dropdown',
						label: 'Source',
						id: 'source',
						default: 'Input1',
						choices: SOURCE_CHOICES,
					},
				],
				callback: async (action) => {
					self.sendShortcutCommand('main_output2_select_named_input', action.options.source)
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