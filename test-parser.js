const shortcutStates = {}
let receiveBuffer = ''

function processTriCasterData(data) {
	receiveBuffer += data

	const stateRegex = /<shortcut_state\s+([^>]*?)\/>/g
	const attributeRegex = /(\w+)="([^"]*)"/g

	let match
	let lastProcessedIndex = 0

	while ((match = stateRegex.exec(receiveBuffer)) !== null) {
		const attributes = {}
		let attributeMatch

		while ((attributeMatch = attributeRegex.exec(match[1])) !== null) {
			attributes[attributeMatch[1]] = attributeMatch[2]
		}

		if (attributes.name !== undefined && attributes.value !== undefined) {
			const oldValue = shortcutStates[attributes.name]
			const newValue = attributes.value

			shortcutStates[attributes.name] = newValue

			if (oldValue !== newValue) {
				console.log(`STATE CHANGED: ${attributes.name} = ${newValue}`)
			}
		}

		lastProcessedIndex = stateRegex.lastIndex
	}

	if (lastProcessedIndex > 0) {
		receiveBuffer = receiveBuffer.substring(lastProcessedIndex)
	}
}

console.log('--- TEST 1: Scripture layout ---')

processTriCasterData(`
<shortcut_states>
	<shortcut_state name="main_a_row_named_input" value="V5" type="unknown" sender="" />
	<shortcut_state name="v8_a_row_named_input" value="Net" type="unknown" sender="" />
	<shortcut_state name="main_output2_select_named_input" value="v8" type="unknown" sender="" />
</shortcut_states>
`)

console.log(shortcutStates)

console.log('\n--- TEST 2: Operator changes Main A ---')

processTriCasterData(`
<shortcut_states>
	<shortcut_state name="main_a_row_named_input" value="Input1" type="unknown" sender="" />
</shortcut_states>
`)

console.log(shortcutStates)

console.log('\n--- TEST 3: Return Main A to V5 ---')

processTriCasterData(`
<shortcut_states>
	<shortcut_state name="main_a_row_named_input" value="V5" type="unknown" sender="" />
</shortcut_states>
`)

console.log(shortcutStates)