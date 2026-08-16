const VARIABLE_STATES = [
	'main_a_row_named_input',
	'main_b_row_named_input',
	'main_output2_select_named_input',
	'main_dsk1_select_named_input',
	'main_dsk2_select_named_input',
	'main_fx_select_named_input',

	'v1_a_row_named_input',
	'v1_b_row_named_input',
	'v2_a_row_named_input',
	'v2_b_row_named_input',
	'v3_a_row_named_input',
	'v3_b_row_named_input',
	'v4_a_row_named_input',
	'v4_b_row_named_input',
	'v5_a_row_named_input',
	'v5_b_row_named_input',
	'v6_a_row_named_input',
	'v6_b_row_named_input',
	'v7_a_row_named_input',
	'v7_b_row_named_input',
	'v8_a_row_named_input',
	'v8_b_row_named_input',

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
			variableId: 'v1_a_row_named_input',
			name: 'M/E1 row A current value',
		})
		variables.push({
			variableId: 'v1_b_row_named_input',
			name: 'M/E1 row B current value',
		})
		variables.push({
			variableId: 'v2_a_row_named_input',
			name: 'M/E2 row A current value',
		})
		variables.push({
			variableId: 'v2_b_row_named_input',
			name: 'M/E2 row B current value',
		})
		variables.push({
			variableId: 'v3_a_row_named_input',
			name: 'M/E3 row A current value',
		})
		variables.push({
			variableId: 'v3_b_row_named_input',
			name: 'M/E3 row B current value',
		})
		variables.push({
			variableId: 'v4_a_row_named_input',
			name: 'M/E4 row A current value',
		})
		variables.push({
			variableId: 'v4_b_row_named_input',
			name: 'M/E4 row B current value',
		})
		variables.push({
			variableId: 'v5_a_row_named_input',
			name: 'M/E5 row A current value',
		})
		variables.push({
			variableId: 'v5_b_row_named_input',
			name: 'M/E5 row B current value',
		})
		variables.push({
			variableId: 'v6_a_row_named_input',
			name: 'M/E6 row A current value',
		})
		variables.push({
			variableId: 'v6_b_row_named_input',
			name: 'M/E6 row B current value',
		})
		variables.push({
			variableId: 'v7_a_row_named_input',
			name: 'M/E7 row A current value',
		})
		variables.push({
			variableId: 'v7_b_row_named_input',
			name: 'M/E7 row B current value',
		})
		variables.push({
			variableId: 'v8_a_row_named_input',
			name: 'M/E8 row A current value',
		})
		variables.push({
			variableId: 'v8_b_row_named_input',
			name: 'M/E8 row B current value',
		})

		variables.push({
			variableId: 'program_tally',
			name: 'Sources currently contributing to Program',
		})
		variables.push({
			variableId: 'preview_tally',
			name: 'Sources currently contributing to Preview',
		})

		this.setVariableDefinitions(variables)
	},
}