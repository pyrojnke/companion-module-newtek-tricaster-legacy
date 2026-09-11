const net = require('net')

const {
	BASE_SOURCE_CHOICES,
	ME_CHOICES,
	DDR_CHOICES,
	ME_SOURCE_CHOICES,
	PROGRAM_SOURCE_CHOICES,
	DSK_SOURCE_CHOICES,
	OUTPUT_CHOICES,
} = require('./choices')

function escapeXmlAttribute(value) {
	return String(value)
		.replace(/&/g, '&amp;')
		.replace(/'/g, '&apos;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
}

const DICTIONARY_KEY_COUNT_CHOICES = Array.from({ length: 13 }, (_, index) => ({
	id: String(index + 1),
	label: String(index + 1),
}))

const DICTIONARY_KEY_FIELDS = Array.from({ length: 12 }, (_, index) => {
	const keyNumber = index + 2

	return [
		{
			type: 'textinput',
			label: `Key ${keyNumber} Name`,
			id: `key${keyNumber}Name`,
			default: '',
			isVisibleExpression: `$(options:keyCount) >= ${keyNumber}`,
		},
		{
			type: 'textinput',
			label: `Key ${keyNumber} Value`,
			id: `key${keyNumber}Value`,
			default: '',
			isVisibleExpression: `$(options:keyCount) >= ${keyNumber}`,
		},
	]
}).flat()

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
			sendDictionaryShortcutCommand: {
				name: 'Advanced: Send Dictionary Shortcut',
				description: 'Send a legacy shortcut command with multiple Key/Value parameters to the TriCaster.',
				options: [
					{
						type: 'textinput',
						label: 'Shortcut Name',
						id: 'shortcutName',
						default: '',
					},
					{
						type: 'dropdown',
						label: 'Number of Keys',
						id: 'keyCount',
						default: '1',
						choices: DICTIONARY_KEY_COUNT_CHOICES,
						disableAutoExpression: true,
					},
					{
						type: 'textinput',
						label: 'Key 1 Name',
						id: 'key1Name',
						default: '',
					},
					{
						type: 'textinput',
						label: 'Key 1 Value',
						id: 'key1Value',
						default: '',
					},
					...DICTIONARY_KEY_FIELDS,
				],
				callback: async (action) => {
					const shortcutName = String(action.options.shortcutName || '').trim()
					const keyCount = Math.min(13, Math.max(1, Number.parseInt(action.options.keyCount, 10) || 1))
					const dictionaryEntries = []

					for (let keyNumber = 1; keyNumber <= keyCount; keyNumber++) {
						const keyName = String(action.options[`key${keyNumber}Name`] ?? '').trim()
						const keyValue = String(action.options[`key${keyNumber}Value`] ?? '').trim()

						if (!keyName || !keyValue) {
							continue
						}

						dictionaryEntries.push({
							name: keyName,
							value: keyValue,
						})
					}

					if (!shortcutName) {
						self.log('warn', 'Dictionary shortcut command not sent because Shortcut Name is blank.')
						return
					}

					if (dictionaryEntries.length === 0) {
						self.log('warn', 'Dictionary shortcut command not sent because no complete Key/Value pairs were provided.')
						return
					}

					self.sendDictionaryShortcutCommand(shortcutName, dictionaryEntries)
				},
			},
			ddrPlay: {
				name: 'DDR: Play',
				description: 'Play the selected DDR if it is currently stopped.',
				options: [
					{
						type: 'dropdown',
						label: 'DDR',
						id: 'ddr',
						choices: DDR_CHOICES,
						default: '1',
					},
				],
				callback: async (action) => {
					const shortcutName = action.options.ddr === '2' ? 'ddr2_play' : 'ddr_play'

					self.sendShortcutCommand(shortcutName, '')
				},
			},
			ddrStop: {
				name: 'DDR: Stop',
				description: 'Stop the selected DDR if it is currently playing.',
				options: [
					{
						type: 'dropdown',
						label: 'DDR',
						id: 'ddr',
						choices: DDR_CHOICES,
						default: '1',
					},
				],
				callback: async (action) => {
					const shortcutName = action.options.ddr === '2' ? 'ddr2_stop' : 'ddr_stop'

					self.sendShortcutCommand(shortcutName, '')
				},
			},
			ddrPreviousClip: {
				name: 'DDR: Previous Clip',
				description: 'Move the selected DDR playhead to the previous clip.',
				options: [
					{
						type: 'dropdown',
						label: 'DDR',
						id: 'ddr',
						choices: DDR_CHOICES,
						default: '1',
					},
				],
				callback: async (action) => {
					const shortcutName = action.options.ddr === '2' ? 'ddr2_back' : 'ddr_back'

					self.sendShortcutCommand(shortcutName, '')
				},
			},
			ddrNextClip: {
				name: 'DDR: Next Clip',
				description: 'Move the selected DDR playhead to the next clip.',
				options: [
					{
						type: 'dropdown',
						label: 'DDR',
						id: 'ddr',
						choices: DDR_CHOICES,
						default: '1',
					},
				],
				callback: async (action) => {
					const shortcutName = action.options.ddr === '2' ? 'ddr2_forward' : 'ddr_forward'

					self.sendShortcutCommand(shortcutName, '')
				},
			},
			ddrLoopMode: {
				name: 'DDR: Loop Mode',
				description: 'Enable, disable, or toggle Loop mode on the selected DDR.',
				options: [
					{
						type: 'dropdown',
						label: 'DDR',
						id: 'ddr',
						choices: DDR_CHOICES,
						default: '1',
					},
					{
						type: 'dropdown',
						label: 'Mode',
						id: 'mode',
						choices: [
							{ id: 'on', label: 'On' },
							{ id: 'off', label: 'Off' },
							{ id: 'toggle', label: 'Toggle' },
						],
						default: 'toggle',
					},
				],
				callback: async (action) => {
					const shortcutName =
						action.options.ddr === '2' ? 'ddr2_loop_mode_toggle' : 'ddr_loop_mode_toggle'

					const value =
						action.options.mode === 'on' ? 'true' : action.options.mode === 'off' ? 'false' : ''

					self.sendShortcutCommand(shortcutName, value)
				},
			},
			ddrSingleMode: {
				name: 'DDR: Single Mode',
				description: 'Enable, disable, or toggle Single mode on the selected DDR.',
				options: [
					{
						type: 'dropdown',
						label: 'DDR',
						id: 'ddr',
						choices: DDR_CHOICES,
						default: '1',
					},
					{
						type: 'dropdown',
						label: 'Mode',
						id: 'mode',
						choices: [
							{ id: 'on', label: 'On' },
							{ id: 'off', label: 'Off' },
							{ id: 'toggle', label: 'Toggle' },
						],
						default: 'toggle',
					},
				],
				callback: async (action) => {
					const shortcutName =
						action.options.ddr === '2' ? 'ddr2_single_mode_toggle' : 'ddr_single_mode_toggle'

					const value =
						action.options.mode === 'on' ? 'true' : action.options.mode === 'off' ? 'false' : ''

					self.sendShortcutCommand(shortcutName, value)
				},
			},
			ddrAutoplayMode: {
				name: 'DDR: Autoplay Mode',
				description: 'Enable, disable, or toggle Autoplay mode on the selected DDR.',
				options: [
					{
						type: 'dropdown',
						label: 'DDR',
						id: 'ddr',
						choices: DDR_CHOICES,
						default: '1',
					},
					{
						type: 'dropdown',
						label: 'Mode',
						id: 'mode',
						choices: [
							{ id: 'on', label: 'On' },
							{ id: 'off', label: 'Off' },
							{ id: 'toggle', label: 'Toggle' },
						],
						default: 'toggle',
					},
				],
				callback: async (action) => {
					const shortcutName =
						action.options.ddr === '2' ? 'ddr2_autoplay_mode_toggle' : 'ddr_autoplay_mode_toggle'

					const value =
						action.options.mode === 'on' ? 'true' : action.options.mode === 'off' ? 'false' : ''

					self.sendShortcutCommand(shortcutName, value)
				},
			},
			runMacroByName: {
				name: 'Macro: Run by Name',
				description: 'Run a TriCaster macro by its exact macro name.',
				options: [
					{
						type: 'textinput',
						label: 'Macro Name',
						id: 'macroName',
						default: '',
					},
				],
				callback: async (action) => {
					const macroName = String(action.options.macroName || '').trim()

					if (!macroName) {
						self.log('warn', 'Macro not run because Macro Name is blank.')
						return
					}

					self.sendShortcutCommand('play_macro_byname', macroName)
				},
			},
			toggleLiveMatte: {
				name: 'LiveMatte: Toggle',
				description: 'Toggle LiveMatte on or off for the selected source.',
				options: [
					{
						type: 'dropdown',
						label: 'Source',
						id: 'source',
						default: 'Net',
						choices: BASE_SOURCE_CHOICES,
					},
				],
				callback: async (action) => {
					const source = String(action.options.source || 'Net').toLowerCase()
					const shortcutName = `${source}_toggle_livematte`

					self.sendShortcutCommand(shortcutName, '')
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
						choices: PROGRAM_SOURCE_CHOICES,
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
			setProgramDskSource: {
				name: 'Program DSK: Set Source',
				description: 'Set the source of Main DSK 1 or Main DSK 2.',
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
						label: 'Source',
						id: 'source',
						default: 'Input1',
						choices: DSK_SOURCE_CHOICES,
					},
				],
				callback: async (action) => {
					const dsk = action.options.dsk === 'dsk2' ? 'dsk2' : 'dsk1'
					const shortcutName = `main_${dsk}_select_named_input`

					self.sendShortcutCommand(shortcutName, action.options.source)
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
						choices: ME_SOURCE_CHOICES,
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
						choices: DSK_SOURCE_CHOICES,
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
						choices: OUTPUT_CHOICES,
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
	sendDictionaryShortcutCommand(shortcutName, dictionaryEntries) {
		if (!this.config.host) {
			this.log('warn', 'Dictionary shortcut command not sent because the TriCaster IP address is not configured.')
			return
		}

		const escapedShortcutName = escapeXmlAttribute(shortcutName)
		const dictionaryAttributes = dictionaryEntries
			.map(
				(entry) =>
					`${escapeXmlAttribute(entry.name)}='${escapeXmlAttribute(entry.value)}'`
			)
			.join(' ')

		const command = `<shortcut name='${escapedShortcutName}' ${dictionaryAttributes} />\n`

		const commandSocket = net.createConnection({
			host: this.config.host,
			port: 5951,
		})

		commandSocket.on('connect', () => {
			if (this.config.verbose) {
				this.log('debug', `Sending dictionary shortcut command: ${command.trim()}`)
			}

			commandSocket.end(command)
		})

		commandSocket.on('error', (error) => {
			this.log('error', `Dictionary shortcut command connection error: ${error.message}`)
			commandSocket.destroy()
		})
	},
}
