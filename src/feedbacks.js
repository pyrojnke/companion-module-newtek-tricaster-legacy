const {
	BASE_SOURCE_CHOICES,
	ME_CHOICES,
	DDR_CHOICES,
	ME_SOURCE_CHOICES,
	PROGRAM_SOURCE_CHOICES,
	DSK_SOURCE_CHOICES,
	OUTPUT_CHOICES,
	TALLY_SOURCE_CHOICES,
} = require('./choices')

function normalizeSource(value) {
	return String(value ?? '').trim().toLowerCase()
}

function getBufferSelectValue(source) {
	const match = /^BFR(\d+)$/i.exec(String(source ?? '').trim())

	if (!match) {
		return null
	}

	const bufferNumber = Number(match[1])

	if (bufferNumber < 1 || bufferNumber > 15) {
		return null
	}

	return bufferNumber + 13
}

module.exports = {
	initFeedbacks() {
		const self = this

		self.setFeedbackDefinitions({
			liveMatteEnabled: {
				name: 'LiveMatte: Status',
				description: 'Active when LiveMatte is enabled for the selected source.',
				type: 'boolean',
				defaultStyle: {
					bgcolor: 0x00ff00,
					color: 0x000000,
				},
				options: [
					{
						type: 'dropdown',
						label: 'Source',
						id: 'source',
						choices: BASE_SOURCE_CHOICES,
						default: 'Net',
					},
				],
				callback: (feedback) => {
					const source = String(feedback.options.source || 'Net').toLowerCase()
					const stateName = `${source}_toggle_livematte`
					const value = String(self.shortcutStates[stateName] ?? '').toLowerCase()

					return value === 'true'
				},
			},
			programPreviewSourceSelected: {
				name: 'Program/Preview: Source Selected',
				description: 'Active when the selected source is currently selected on the Main Program or Preview row.',
				type: 'boolean',
				defaultStyle: {
					bgcolor: 0xff0000,
					color: 0xffffff,
				},
				options: [
					{
						type: 'dropdown',
						label: 'Row',
						id: 'row',
						choices: [
							{ id: 'program', label: 'Program' },
							{ id: 'preview', label: 'Preview' },
						],
						default: 'program',
					},
					{
						type: 'dropdown',
						label: 'Source',
						id: 'source',
						choices: PROGRAM_SOURCE_CHOICES,
						default: 'Input1',
					},
				],
				callback: (feedback) => {
					const stateName =
						feedback.options.row === 'preview'
							? 'main_b_row_named_input'
							: 'main_a_row_named_input'

					return normalizeSource(self.shortcutStates[stateName]) === normalizeSource(feedback.options.source)
				},
			},
			programDskOnAir: {
				name: 'Program DSK: On Air',
				description: 'Active when the selected Main DSK is contributing to Program.',
				type: 'boolean',
				defaultStyle: {
					bgcolor: 0xff0000,
					color: 0xffffff,
				},
				options: [
					{
						type: 'dropdown',
						label: 'DSK',
						id: 'dsk',
						choices: [
							{ id: '1', label: 'DSK 1' },
							{ id: '2', label: 'DSK 2' },
						],
						default: '1',
					},
				],
				callback: (feedback) => {
					const stateName =
						feedback.options.dsk === '2'
							? 'main_dsk2_value'
							: 'main_dsk1_value'

					const value = Number(self.shortcutStates[stateName] ?? 0)

					return Number.isFinite(value) && value > 0
				},
			},
			programDskSourceSelected: {
				name: 'Program DSK: Source Selected',
				description: 'Active when the selected source is currently selected on Main DSK 1 or Main DSK 2.',
				type: 'boolean',
				defaultStyle: {
					bgcolor: 0xff0000,
					color: 0xffffff,
				},
				options: [
					{
						type: 'dropdown',
						label: 'DSK',
						id: 'dsk',
						choices: [
							{ id: '1', label: 'DSK 1' },
							{ id: '2', label: 'DSK 2' },
						],
						default: '1',
					},
					{
						type: 'dropdown',
						label: 'Source',
						id: 'source',
						choices: DSK_SOURCE_CHOICES,
						default: 'Input1',
					},
				],
				callback: (feedback) => {
					const dsk = feedback.options.dsk === '2' ? '2' : '1'
					const bufferSelectValue = getBufferSelectValue(feedback.options.source)

					if (bufferSelectValue !== null) {
						const stateName = `main_dsk${dsk}_select`
						return Number(self.shortcutStates[stateName]) === bufferSelectValue
					}

					const stateName = `main_dsk${dsk}_select_named_input`

					return (
						normalizeSource(self.shortcutStates[stateName]) ===
						normalizeSource(feedback.options.source)
					)
				},
			},
			meRowSourceSelected: {
				name: 'M/E Row: Source Selected',
				description: 'Active when the selected source is currently selected on the chosen M/E A or B row.',
				type: 'boolean',
				defaultStyle: {
					bgcolor: 0xff0000,
					color: 0xffffff,
				},
				options: [
					{
						type: 'dropdown',
						label: 'M/E',
						id: 'me',
						choices: ME_CHOICES,
						default: '1',
					},
					{
						type: 'dropdown',
						label: 'Row',
						id: 'row',
						choices: [
							{ id: 'a', label: 'A' },
							{ id: 'b', label: 'B' },
						],
						default: 'a',
					},
					{
						type: 'dropdown',
						label: 'Source',
						id: 'source',
						choices: ME_SOURCE_CHOICES,
						default: 'Input1',
					},
				],
				callback: (feedback) => {
					const me = String(feedback.options.me || '1')
					const row = feedback.options.row === 'b' ? 'b' : 'a'
					const stateName = `v${me}_${row}_row_named_input`

					return normalizeSource(self.shortcutStates[stateName]) === normalizeSource(feedback.options.source)
				},
			},
			meDskSourceSelected: {
				name: 'M/E DSK: Source Selected',
				description: 'Active when the selected source is currently selected on the chosen M/E DSK.',
				type: 'boolean',
				defaultStyle: {
					bgcolor: 0xff0000,
					color: 0xffffff,
				},
				options: [
					{
						type: 'dropdown',
						label: 'M/E',
						id: 'me',
						choices: ME_CHOICES,
						default: '1',
					},
					{
						type: 'dropdown',
						label: 'Source',
						id: 'source',
						choices: DSK_SOURCE_CHOICES,
						default: 'Input1',
					},
				],
				callback: (feedback) => {
					const me = String(feedback.options.me || '1')
					const bufferSelectValue = getBufferSelectValue(feedback.options.source)

					if (bufferSelectValue !== null) {
						const stateName = `v${me}_dsk1_select`
						return Number(self.shortcutStates[stateName]) === bufferSelectValue
					}

					const stateName = `v${me}_dsk1_select_named_input`

					return normalizeSource(self.shortcutStates[stateName]) === normalizeSource(feedback.options.source)
				},
			},
			meDskOnAir: {
				name: 'M/E DSK: On Air',
				description: 'Active when the DSK on the selected M/E is contributing.',
				type: 'boolean',
				defaultStyle: {
					bgcolor: 0xff0000,
					color: 0xffffff,
				},
				options: [
					{
						type: 'dropdown',
						label: 'M/E',
						id: 'me',
						choices: ME_CHOICES,
						default: '1',
					},
				],
				callback: (feedback) => {
					const me = String(feedback.options.me || '1')
					const stateName = `v${me}_dsk1_value`
					const value = Number(self.shortcutStates[stateName] ?? 0)

					return Number.isFinite(value) && value > 0
				},
			},
			output2SourceSelected: {
				name: 'Output 2: Source Selected',
				description: 'Active when the selected source is currently routed to TriCaster Output 2.',
				type: 'boolean',
				defaultStyle: {
					bgcolor: 0xff0000,
					color: 0xffffff,
				},
				options: [
					{
						type: 'dropdown',
						label: 'Source',
						id: 'source',
						choices: OUTPUT_CHOICES,
						default: 'Input1',
					},
				],
				callback: (feedback) => {
					return (
						normalizeSource(self.shortcutStates.main_output2_select_named_input) ===
						normalizeSource(feedback.options.source)
					)
				},
			},
			ddrPlaying: {
				name: 'DDR: Playing',
				description: 'Active when the selected DDR is currently playing.',
				type: 'boolean',
				defaultStyle: {
					bgcolor: 0xff0000,
					color: 0xffffff,
				},
				options: [
					{
						type: 'dropdown',
						label: 'DDR',
						id: 'ddr',
						choices: DDR_CHOICES,
						default: '1',
					},
				],
				callback: (feedback) => {
					const stateName =
						feedback.options.ddr === '2'
							? 'ddr2_play'
							: 'ddr_play'

					return String(self.shortcutStates[stateName] ?? '').toLowerCase() === 'true'
				},
			},
			ddrStopped: {
				name: 'DDR: Stopped',
				description: 'Active when the selected DDR is currently stopped.',
				type: 'boolean',
				defaultStyle: {
					bgcolor: 0xff0000,
					color: 0xffffff,
				},
				options: [
					{
						type: 'dropdown',
						label: 'DDR',
						id: 'ddr',
						choices: DDR_CHOICES,
						default: '1',
					},
				],
				callback: (feedback) => {
					const stateName = feedback.options.ddr === '2' ? 'ddr2_stop' : 'ddr_stop'

					return String(self.shortcutStates[stateName] ?? '').toLowerCase() === 'true'
				},
			},
			ddrLoopMode: {
				name: 'DDR: Loop Mode',
				description: 'Active when Loop mode is enabled on the selected DDR.',
				type: 'boolean',
				defaultStyle: {
					bgcolor: 0xff0000,
					color: 0xffffff,
				},
				options: [
					{
						type: 'dropdown',
						label: 'DDR',
						id: 'ddr',
						choices: DDR_CHOICES,
						default: '1',
					},
				],
				callback: (feedback) => {
					const stateName = feedback.options.ddr === '2' ? 'ddr2_loop_mode_toggle' : 'ddr_loop_mode_toggle'

					return String(self.shortcutStates[stateName] ?? '').toLowerCase() === 'true'
				},
			},
			ddrSingleMode: {
				name: 'DDR: Single Mode',
				description: 'Active when Single mode is enabled on the selected DDR.',
				type: 'boolean',
				defaultStyle: {
					bgcolor: 0xff0000,
					color: 0xffffff,
				},
				options: [
					{
						type: 'dropdown',
						label: 'DDR',
						id: 'ddr',
						choices: DDR_CHOICES,
						default: '1',
					},
				],
				callback: (feedback) => {
					const stateName = feedback.options.ddr === '2' ? 'ddr2_single_mode_toggle' : 'ddr_single_mode_toggle'

					return String(self.shortcutStates[stateName] ?? '').toLowerCase() === 'true'
				},
			},
			ddrAutoplayMode: {
				name: 'DDR: Autoplay Mode',
				description: 'Active when Autoplay mode is enabled on the selected DDR.',
				type: 'boolean',
				defaultStyle: {
					bgcolor: 0xff0000,
					color: 0xffffff,
				},
				options: [
					{
						type: 'dropdown',
						label: 'DDR',
						id: 'ddr',
						choices: DDR_CHOICES,
						default: '1',
					},
				],
				callback: (feedback) => {
					const stateName =
						feedback.options.ddr === '2' ? 'ddr2_autoplay_mode_toggle' : 'ddr_autoplay_mode_toggle'

					return String(self.shortcutStates[stateName] ?? '').toLowerCase() === 'true'
				},
			},
			tallySourceOnProgramPreview: {
				name: 'Tally: Source On Program/Preview',
				description: 'Active when the selected source is contributing to Program or Preview tally.',
				type: 'boolean',
				defaultStyle: {
					bgcolor: 0xff0000,
					color: 0xffffff,
				},
				options: [
					{
						type: 'dropdown',
						label: 'Tally',
						id: 'tally',
						choices: [
							{ id: 'program', label: 'Program' },
							{ id: 'preview', label: 'Preview' },
						],
						default: 'program',
					},
					{
						type: 'dropdown',
						label: 'Source',
						id: 'source',
						choices: TALLY_SOURCE_CHOICES,
						default: 'Input1',
					},
				],
				callback: (feedback) => {
					const stateName =
						feedback.options.tally === 'preview'
							? 'preview_tally'
							: 'program_tally'

					const tallySources = String(self.shortcutStates[stateName] ?? '')
						.split('|')
						.map((source) => normalizeSource(source))
						.filter((source) => source !== '')

					return tallySources.includes(normalizeSource(feedback.options.source))
				},
			},
			shortcutStateEquals: {
				name: 'Advanced: Shortcut State Equals',
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
			shortcutStatesMultiple: {
				name: 'Advanced: Shortcut States - Multiple Conditions',
				description: 'Active when multiple TriCaster shortcut state conditions match using AND or OR logic.',
				type: 'boolean',
				defaultStyle: {
					bgcolor: 0xff0000,
					color: 0xffffff,
				},
				options: [
					{
						type: 'dropdown',
						label: 'Match Logic',
						id: 'logic',
						choices: [
							{ id: 'and', label: 'AND - All conditions must match' },
							{ id: 'or', label: 'OR - Any condition may match' },
						],
						default: 'and',
					},

					{
						type: 'textinput',
						label: 'State Name 1',
						id: 'stateName1',
						default: '',
					},
					{
						type: 'dropdown',
						label: 'Comparison 1',
						id: 'comparison1',
						choices: [
							{ id: 'equals', label: 'Equal' },
							{ id: 'notEquals', label: 'Not Equal' },
						],
						default: 'equals',
					},
					{
						type: 'textinput',
						label: 'Expected Value 1',
						id: 'expectedValue1',
						default: '',
					},

					{
						type: 'textinput',
						label: 'State Name 2',
						id: 'stateName2',
						default: '',
					},
					{
						type: 'dropdown',
						label: 'Comparison 2',
						id: 'comparison2',
						choices: [
							{ id: 'equals', label: 'Equal' },
							{ id: 'notEquals', label: 'Not Equal' },
						],
						default: 'equals',
					},
					{
						type: 'textinput',
						label: 'Expected Value 2',
						id: 'expectedValue2',
						default: '',
					},

					{
						type: 'textinput',
						label: 'State Name 3',
						id: 'stateName3',
						default: '',
					},
					{
						type: 'dropdown',
						label: 'Comparison 3',
						id: 'comparison3',
						choices: [
							{ id: 'equals', label: 'Equal' },
							{ id: 'notEquals', label: 'Not Equal' },
						],
						default: 'equals',
					},
					{
						type: 'textinput',
						label: 'Expected Value 3',
						id: 'expectedValue3',
						default: '',
					},

					{
						type: 'textinput',
						label: 'State Name 4',
						id: 'stateName4',
						default: '',
					},
					{
						type: 'dropdown',
						label: 'Comparison 4',
						id: 'comparison4',
						choices: [
							{ id: 'equals', label: 'Equal' },
							{ id: 'notEquals', label: 'Not Equal' },
						],
						default: 'equals',
					},
					{
						type: 'textinput',
						label: 'Expected Value 4',
						id: 'expectedValue4',
						default: '',
					},
				],
				callback: (feedback) => {
					const results = []

					for (let i = 1; i <= 4; i++) {
						const stateName = String(feedback.options[`stateName${i}`] || '').trim()

						// Blank state names are unused conditions.
						if (!stateName) {
							continue
						}

						const expectedValue = String(feedback.options[`expectedValue${i}`] ?? '')
						const comparison = feedback.options[`comparison${i}`] || 'equals'
						const actualValue = String(self.shortcutStates[stateName] ?? '')

						if (comparison === 'notEquals') {
							results.push(actualValue !== expectedValue)
						} else {
							results.push(actualValue === expectedValue)
						}
					}

					// Do not activate a feedback with no configured conditions.
					if (results.length === 0) {
						return false
					}

					if (feedback.options.logic === 'or') {
						return results.some((result) => result)
					}

					return results.every((result) => result)
				},
			},
		})
	},
}
