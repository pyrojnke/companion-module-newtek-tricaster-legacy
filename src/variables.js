const VARIABLE_STATES = [
	'main_a_row_named_input',
	'main_b_row_named_input',
	'main_output2_select_named_input',
	'main_dsk1_select_named_input',
	'main_dsk2_select_named_input',
	'main_fx_select_named_input',

	'main_dsk1_value',
	'main_dsk2_value',
	'main_value',
	'main_auto',

	'v1_a_row_named_input',
	'v1_b_row_named_input',
	'v1_dsk1_select_named_input',
	'v1_dsk1_value',
	'v2_a_row_named_input',
	'v2_b_row_named_input',
	'v2_dsk1_select_named_input',
	'v2_dsk1_value',
	'v3_a_row_named_input',
	'v3_b_row_named_input',
	'v3_dsk1_select_named_input',
	'v3_dsk1_value',
	'v4_a_row_named_input',
	'v4_b_row_named_input',
	'v4_dsk1_select_named_input',
	'v4_dsk1_value',
	'v5_a_row_named_input',
	'v5_b_row_named_input',
	'v5_dsk1_select_named_input',
	'v5_dsk1_value',
	'v6_a_row_named_input',
	'v6_b_row_named_input',
	'v6_dsk1_select_named_input',
	'v6_dsk1_value',
	'v7_a_row_named_input',
	'v7_b_row_named_input',
	'v7_dsk1_select_named_input',
	'v7_dsk1_value',
	'v8_a_row_named_input',
	'v8_b_row_named_input',
	'v8_dsk1_select_named_input',
	'v8_dsk1_value',

	'ddr_play',
	'ddr_stop',
	'ddr2_play',
	'ddr2_stop',

	'program_tally',
	'preview_tally',
]

module.exports = {
	variableStates: VARIABLE_STATES,

	initVariables() {
		const variables = []

		variables.push({
			variableId: 'main_a_row_named_input',
			name: 'Main program row current value',
		})
		variables.push({
			variableId: 'main_b_row_named_input',
			name: 'Main preview row current value',
		})
		variables.push({
			variableId: 'main_output2_select_named_input',
			name: 'Output 2 current source',
		})
		variables.push({
			variableId: 'main_dsk1_select_named_input',
			name: 'Main DSK 1 current source',
		})
		variables.push({
			variableId: 'main_dsk2_select_named_input',
			name: 'Main DSK 2 current source',
		})
		variables.push({
			variableId: 'main_fx_select_named_input',
			name: 'Main FX current source',
		})
		variables.push({
			variableId: 'main_dsk1_value',
			name: 'Main DSK 1 transition/on-air value',
		})
		variables.push({
			variableId: 'main_dsk2_value',
			name: 'Main DSK 2 transition/on-air value',
		})
		variables.push({
			variableId: 'main_value',
			name: 'Main transition position',
		})
		variables.push({
			variableId: 'main_auto',
			name: 'Main AUTO transition active',
		})

		for (let me = 1; me <= 8; me++) {
			variables.push({
				variableId: `v${me}_a_row_named_input`,
				name: `M/E${me} row A current value`,
			})
			variables.push({
				variableId: `v${me}_b_row_named_input`,
				name: `M/E${me} row B current value`,
			})
			variables.push({
				variableId: `v${me}_dsk1_select_named_input`,
				name: `M/E${me} DSK current source`,
			})
			variables.push({
				variableId: `v${me}_dsk1_value`,
				name: `M/E${me} DSK transition/on-air value`,
			})
		}

		variables.push({
			variableId: 'ddr_play',
			name: 'DDR 1 Play state',
		})
		variables.push({
			variableId: 'ddr_stop',
			name: 'DDR 1 Stop state',
		})
		variables.push({
			variableId: 'ddr2_play',
			name: 'DDR 2 Play state',
		})
		variables.push({
			variableId: 'ddr2_stop',
			name: 'DDR 2 Stop state',
		})
	
		variables.push({
			variableId: 'program_tally',
			name: 'Sources currently contributing to Program',
		})
		variables.push({
			variableId: 'preview_tally',
			name: 'Sources currently contributing to Preview',
		})

		this.setVariableDefinitions(
			Object.fromEntries(
				variables.map(({ variableId, ...definition }) => [variableId, definition])
			)
		)
	},
}
