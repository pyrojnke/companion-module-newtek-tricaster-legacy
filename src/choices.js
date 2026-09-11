const BASE_SOURCE_CHOICES = [
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
	{ id: 'Stills', label: 'GFX1 (Stills)' },
	{ id: 'Titles', label: 'GFX2 (Titles)' },
	{ id: 'Black', label: 'BLACK' },
]

const BUFFERS = [
	{ id: 'BFR1', label: 'Buffer 1' },
	{ id: 'BFR2', label: 'Buffer 2' },
	{ id: 'BFR3', label: 'Buffer 3' },
	{ id: 'BFR4', label: 'Buffer 4' },
	{ id: 'BFR5', label: 'Buffer 5' },
	{ id: 'BFR6', label: 'Buffer 6' },
	{ id: 'BFR7', label: 'Buffer 7' },
	{ id: 'BFR8', label: 'Buffer 8' },
	{ id: 'BFR9', label: 'Buffer 9' },
	{ id: 'BFR10', label: 'Buffer 10' },
	{ id: 'BFR11', label: 'Buffer 11' },
	{ id: 'BFR12', label: 'Buffer 12' },
	{ id: 'BFR13', label: 'Buffer 13' },
	{ id: 'BFR14', label: 'Buffer 14' },
	{ id: 'BFR15', label: 'Buffer 15' },
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

const DDR_CHOICES = [
	{ id: '1', label: 'DDR 1' },
	{ id: '2', label: 'DDR 2' },
]

const ME_SOURCE_CHOICES = [
	...BASE_SOURCE_CHOICES,
	{ id: 'framebuffer', label: 'Buffer' },
]

const PROGRAM_SOURCE_CHOICES = [
	...BASE_SOURCE_CHOICES,
	{ id: 'framebuffer', label: 'Buffer' },
	...ME_CHOICES.map((choice) => ({
		id: `V${choice.id}`,
		label: choice.label,
	})),
]

const DSK_SOURCE_CHOICES = [
	...BASE_SOURCE_CHOICES,
	...BUFFERS,
]

const OUTPUT_CHOICES = [
	...BASE_SOURCE_CHOICES,
	...ME_CHOICES.map((choice) => ({
		id: `V${choice.id}`,
		label: choice.label,
	})),
	{ id: 'preview', label: 'PREVIEW' },
	{ id: 'program', label: 'PROGRAM' },
	{ id: 'program (clean)', label: 'PROGRAM (CLEAN)' },
	...BUFFERS,
]

const TALLY_SOURCE_CHOICES = [
	...BASE_SOURCE_CHOICES,
	...ME_CHOICES.map((choice) => ({
		id: `V${choice.id}`,
		label: choice.label,
	})),
	...BUFFERS,
]

module.exports = {
	BASE_SOURCE_CHOICES,
	BUFFERS,
	ME_CHOICES,
	DDR_CHOICES,
	ME_SOURCE_CHOICES,
	PROGRAM_SOURCE_CHOICES,
	DSK_SOURCE_CHOICES,
	OUTPUT_CHOICES,
	TALLY_SOURCE_CHOICES,
}