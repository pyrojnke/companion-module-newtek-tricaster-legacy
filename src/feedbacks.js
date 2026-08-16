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
			shortcutStatesMultiple: {
				name: 'Shortcut States - Multiple Conditions',
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
