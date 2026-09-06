const { combineRgb } = require('@companion-module/base')
const {
	PROGRAM_SOURCE_CHOICES,
	ME_CHOICES,
	ME_SOURCE_CHOICES,
	DSK_SOURCE_CHOICES,
	OUTPUT_CHOICES,
} = require('./choices')

function getSourceButtonText(sourceId) {
        if (/^Input[1-8]$/.test(sourceId)) {
                return sourceId.replace('Input', '')
        }

        if (/^V[1-8]$/.test(sourceId)) {
                return sourceId.replace('V', 'M/E')
        }

		if (/^BFR(\d{1,2})$/.test(sourceId)) {
			return sourceId.replace(/^BFR/, 'BFR\n')
		}
		
        switch (sourceId) {
                case 'Net':
                        return 'NET1'
                case 'Net2':
                        return 'NET2'
                case 'DDR':
                        return 'DDR1'
                case 'DDR2':
                        return 'DDR2'
                case 'Stills':
                        return 'GFX1'
                case 'Titles':
                        return 'GFX2'
                case 'Black':
                        return 'BLACK'
                case 'framebuffer':
                        return 'BFR'
				case 'preview':
					return 'PVW'
				case 'program':
					return 'PGM'
				case 'program (clean)':
					return 'PGM\n(CLEAN)'
                default:
                        return String(sourceId).toUpperCase()
        }
}

function makePresetId(destination, sourceId) {
        return `${destination}${String(sourceId).replace(/[^A-Za-z0-9]/g, '')}`
}

module.exports = {
        initPresets() {
                const self = this
                const presets = {}

                const colorWhite = combineRgb(255, 255, 255)
                const colorBlack = combineRgb(0, 0, 0)
                const colorRed = combineRgb(255, 0, 0)
                const colorGreen = combineRgb(0, 255, 0)

                const createSourcePreset = (destination, sourceChoice) => {
                        const isProgram = destination === 'program'
                        const headerText = isProgram ? 'PROGRAM' : 'PREVIEW'
                        const activeColor = isProgram ? colorRed : colorGreen
                        const presetId = makePresetId(destination, sourceChoice.id)

                        presets[presetId] = {
                                type: 'layered',
                                name: `${isProgram ? 'Program' : 'Preview'} - ${sourceChoice.label}`,
                                canvas: {
                                        decoration: { isExpression: false, value: 'none' },
                                },
                                elements: [
                                        {
                                                type: 'box',
                                                id: 'background',
                                                x: { isExpression: false, value: 0 },
                                                y: { isExpression: false, value: 0 },
                                                width: { isExpression: false, value: 100 },
                                                height: { isExpression: false, value: 100 },
                                                color: { isExpression: false, value: colorBlack },
                                        },
                                        {
                                                type: 'text',
                                                id: 'header',
                                                name: 'Text',
                                                x: { isExpression: false, value: 4 },
                                                y: { isExpression: false, value: 4 },
                                                width: { isExpression: false, value: 92 },
                                                height: { isExpression: false, value: 34 },
                                                text: { isExpression: false, value: headerText },
                                                fontsize: { isExpression: false, value: 38 },
                                                fontsizeAllowShrink: { isExpression: false, value: true },
                                                font: { isExpression: false, value: 'companion-sans' },
                                                color: { isExpression: false, value: colorWhite },
                                                halign: { isExpression: false, value: 'center' },
                                                valign: { isExpression: false, value: 'top' },
                                        },
                                        {
                                                type: 'text',
                                                id: 'source',
                                                name: 'Text2',
                                                x: { isExpression: false, value: 2 },
                                                y: { isExpression: false, value: 15 },
                                                width: { isExpression: false, value: 96 },
                                                height: { isExpression: false, value: 83 },
                                                text: {
                                                        isExpression: false,
                                                        value: getSourceButtonText(sourceChoice.id),
                                                },
                                                fontsize: {
														isExpression: false,
														value: sourceChoice.id === 'Black' ? 39 : 120,
												},
                                                fontsizeAllowShrink: { isExpression: false, value: true },
                                                font: { isExpression: false, value: 'companion-sans' },
                                                color: { isExpression: false, value: colorWhite },
                                                halign: { isExpression: false, value: 'center' },
                                                valign: { isExpression: false, value: 'center' },
                                        },
                                ],
                                steps: [
                                        {
                                                down: [
                                                        {
                                                                actionId: 'setProgramPreviewSource',
                                                                options: {
                                                                        destination,
                                                                        source: sourceChoice.id,
                                                                },
                                                        },
                                                ],
                                                up: [],
                                        },
                                ],
                                feedbacks: [
                                        {
                                                feedbackId: 'programPreviewSourceSelected',
                                                options: {
                                                        row: destination,
                                                        source: sourceChoice.id,
                                                },
                                                styleOverrides: [
                                                        {
                                                                elementId: 'background',
                                                                elementProperty: 'color',
                                                                override: {
                                                                        isExpression: false,
                                                                        value: activeColor,
                                                                },
                                                        },
                                                ],
                                        },
                                ],
                        }

                        return presetId
                }
				
				const createProgramTransitionPreset = (transition) => {
					const transitionText = transition === 'cut' ? 'CUT' : 'AUTO'
					const presetId = `program${transitionText}`

					presets[presetId] = {
						type: 'layered',
						name: `Program - ${transitionText}`,
						canvas: {
							decoration: { isExpression: false, value: 'none' },
						},
						elements: [
							{
								type: 'box',
								id: 'background',
								x: { isExpression: false, value: 0 },
								y: { isExpression: false, value: 0 },
								width: { isExpression: false, value: 100 },
								height: { isExpression: false, value: 100 },
								color: { isExpression: false, value: colorBlack },
							},
							{
								type: 'text',
								id: 'header',
								name: 'Text',
								x: { isExpression: false, value: 4 },
								y: { isExpression: false, value: 4 },
								width: { isExpression: false, value: 92 },
								height: { isExpression: false, value: 34 },
								text: { isExpression: false, value: 'PROGRAM' },
								fontsize: { isExpression: false, value: 38 },
								fontsizeAllowShrink: { isExpression: false, value: true },
								font: { isExpression: false, value: 'companion-sans' },
								color: { isExpression: false, value: colorWhite },
								halign: { isExpression: false, value: 'center' },
								valign: { isExpression: false, value: 'top' },
							},
							{
								type: 'text',
								id: 'source',
								name: 'Text2',
								x: { isExpression: false, value: 2 },
								y: { isExpression: false, value: 15 },
								width: { isExpression: false, value: 96 },
								height: { isExpression: false, value: 83 },
								text: { isExpression: false, value: transitionText },
								fontsize: {
									isExpression: false,
									value: transition === 'auto' ? 47 : 120,
								},
								fontsizeAllowShrink: { isExpression: false, value: true },
								font: { isExpression: false, value: 'companion-sans' },
								color: { isExpression: false, value: colorWhite },
								halign: { isExpression: false, value: 'center' },
								valign: { isExpression: false, value: 'center' },
							},
						],
						steps: [
							{
								down: [
									{
										actionId: 'programTransition',
										options: {
											transition,
										},
									},
								],
								up: [],
							},
						],
						feedbacks: [],
					}

					return presetId
				}
	
				const createProgramDskSourcePreset = (dskNumber, sourceChoice) => {
                        const headerText = `PGM DSK ${dskNumber}`
                        const presetId = `pgmDsk${dskNumber}${String(sourceChoice.id).replace(/[^A-Za-z0-9]/g, '')}`

                        presets[presetId] = {
                                type: 'layered',
                                name: `Pgm DSK ${dskNumber} - ${sourceChoice.label}`,
                                canvas: {
                                        decoration: { isExpression: false, value: 'none' },
                                },
                                elements: [
                                        {
                                                type: 'box',
                                                id: 'background',
                                                x: { isExpression: false, value: 0 },
                                                y: { isExpression: false, value: 0 },
                                                width: { isExpression: false, value: 100 },
                                                height: { isExpression: false, value: 100 },
                                                color: { isExpression: false, value: colorBlack },
                                        },
                                        {
                                                type: 'text',
                                                id: 'header',
                                                name: 'Text',
                                                x: { isExpression: false, value: 4 },
                                                y: { isExpression: false, value: 4 },
                                                width: { isExpression: false, value: 92 },
                                                height: { isExpression: false, value: 34 },
                                                text: { isExpression: false, value: headerText },
                                                fontsize: { isExpression: false, value: 38 },
                                                fontsizeAllowShrink: { isExpression: false, value: true },
                                                font: { isExpression: false, value: 'companion-sans' },
                                                color: { isExpression: false, value: colorWhite },
                                                halign: { isExpression: false, value: 'center' },
                                                valign: { isExpression: false, value: 'top' },
                                        },
                                        {
                                                type: 'text',
                                                id: 'source',
                                                name: 'Text2',
                                                x: { isExpression: false, value: 2 },
                                                y: { isExpression: false, value: 15 },
                                                width: { isExpression: false, value: 96 },
                                                height: { isExpression: false, value: 83 },
                                                text: {
                                                        isExpression: false,
                                                        value: getSourceButtonText(sourceChoice.id),
                                                },
                                                fontsize: {
                                                        isExpression: false,
                                                        value: sourceChoice.id === 'Black' ? 39 : 120,
                                                },
                                                fontsizeAllowShrink: { isExpression: false, value: true },
                                                font: { isExpression: false, value: 'companion-sans' },
                                                color: { isExpression: false, value: colorWhite },
                                                halign: { isExpression: false, value: 'center' },
                                                valign: { isExpression: false, value: 'center' },
                                        },
                                ],
                                steps: [
                                        {
                                                down: [
                                                        {
                                                                actionId: 'setProgramDskSource',
                                                                options: {
                                                                        dsk: `dsk${dskNumber}`,
                                                                        source: sourceChoice.id,
                                                                },
                                                        },
                                                ],
                                                up: [],
                                        },
                                ],
                                feedbacks: [
                                        {
                                                feedbackId: 'programDskSourceSelected',
                                                options: {
                                                        dsk: String(dskNumber),
                                                        source: sourceChoice.id,
                                                },
                                                styleOverrides: [
                                                        {
                                                                elementId: 'background',
                                                                elementProperty: 'color',
                                                                override: {
                                                                        isExpression: false,
                                                                        value: colorRed,
                                                                },
                                                        },
                                                ],
                                        },
                                ],
                        }

                        return presetId
                }
				
				const createProgramDskTransitionPreset = (dskNumber, transition) => {
					const headerText = `PGM DSK ${dskNumber}`
					const transitionText = transition === 'cut' ? 'CUT' : 'AUTO'
					const presetId = `pgmDsk${dskNumber}${transitionText}`

					presets[presetId] = {
						type: 'layered',
						name: `Pgm DSK ${dskNumber} - ${transitionText}`,
						canvas: {
							decoration: { isExpression: false, value: 'none' },
						},
						elements: [
							{
								type: 'box',
								id: 'background',
								x: { isExpression: false, value: 0 },
								y: { isExpression: false, value: 0 },
								width: { isExpression: false, value: 100 },
								height: { isExpression: false, value: 100 },
								color: { isExpression: false, value: colorBlack },
							},
							{
								type: 'text',
								id: 'header',
								name: 'Text',
								x: { isExpression: false, value: 4 },
								y: { isExpression: false, value: 4 },
								width: { isExpression: false, value: 92 },
								height: { isExpression: false, value: 34 },
								text: { isExpression: false, value: headerText },
								fontsize: { isExpression: false, value: 38 },
								fontsizeAllowShrink: { isExpression: false, value: true },
								font: { isExpression: false, value: 'companion-sans' },
								color: { isExpression: false, value: colorWhite },
								halign: { isExpression: false, value: 'center' },
								valign: { isExpression: false, value: 'top' },
							},
							{
								type: 'text',
								id: 'source',
								name: 'Text2',
								x: { isExpression: false, value: 2 },
								y: { isExpression: false, value: 15 },
								width: { isExpression: false, value: 96 },
								height: { isExpression: false, value: 83 },
								text: { isExpression: false, value: transitionText },
								fontsize: {
									isExpression: false,
									value: transition === 'auto' ? 47 : 120,
								},
								fontsizeAllowShrink: { isExpression: false, value: true },
								font: { isExpression: false, value: 'companion-sans' },
								color: { isExpression: false, value: colorWhite },
								halign: { isExpression: false, value: 'center' },
								valign: { isExpression: false, value: 'center' },
							},
						],
						steps: [
							{
								down: [
									{
										actionId: 'programDskTransition',
										options: {
											dsk: `dsk${dskNumber}`,
											transition,
										},
									},
								],
								up: [],
							},
						],
						feedbacks: [
							{
								feedbackId: 'programDskOnAir',
								options: {
									dsk: String(dskNumber),
								},
								styleOverrides: [
									{
										elementId: 'background',
										elementProperty: 'color',
										override: {
											isExpression: false,
											value: colorRed,
										},
									},
								],
							},
						],
					}

					return presetId
				}
				
				const createMeRowSourcePreset = (meNumber, row, sourceChoice) => {
					const rowText = row === 'b' ? 'B' : 'A'
					const headerText = `M/E${meNumber} ${rowText}`
					const presetId = `me${meNumber}${rowText}${String(sourceChoice.id).replace(/[^A-Za-z0-9]/g, '')}`

					presets[presetId] = {
						type: 'layered',
						name: `M/E${meNumber} ${rowText} - ${sourceChoice.label}`,
						canvas: {
							decoration: { isExpression: false, value: 'none' },
						},
						elements: [
							{
								type: 'box',
								id: 'background',
								x: { isExpression: false, value: 0 },
								y: { isExpression: false, value: 0 },
								width: { isExpression: false, value: 100 },
								height: { isExpression: false, value: 100 },
								color: { isExpression: false, value: colorBlack },
							},
							{
								type: 'text',
								id: 'header',
								name: 'Text',
								x: { isExpression: false, value: 4 },
								y: { isExpression: false, value: 4 },
								width: { isExpression: false, value: 92 },
								height: { isExpression: false, value: 34 },
								text: { isExpression: false, value: headerText },
								fontsize: { isExpression: false, value: 38 },
								fontsizeAllowShrink: { isExpression: false, value: true },
								font: { isExpression: false, value: 'companion-sans' },
								color: { isExpression: false, value: colorWhite },
								halign: { isExpression: false, value: 'center' },
								valign: { isExpression: false, value: 'top' },
							},
							{
								type: 'text',
								id: 'source',
								name: 'Text2',
								x: { isExpression: false, value: 2 },
								y: { isExpression: false, value: 15 },
								width: { isExpression: false, value: 96 },
								height: { isExpression: false, value: 83 },
								text: {
									isExpression: false,
									value: getSourceButtonText(sourceChoice.id),
								},
								fontsize: {
									isExpression: false,
									value: sourceChoice.id === 'Black' ? 39 : 120,
								},
								fontsizeAllowShrink: { isExpression: false, value: true },
								font: { isExpression: false, value: 'companion-sans' },
								color: { isExpression: false, value: colorWhite },
								halign: { isExpression: false, value: 'center' },
								valign: { isExpression: false, value: 'center' },
							},
						],
						steps: [
							{
								down: [
									{
										actionId: 'setMeSource',
										options: {
											me: String(meNumber),
											row,
											source: sourceChoice.id,
										},
									},
								],
								up: [],
							},
						],
						feedbacks: [
							{
								feedbackId: 'meRowSourceSelected',
								options: {
									me: String(meNumber),
									row,
									source: sourceChoice.id,
								},
								styleOverrides: [
									{
										elementId: 'background',
										elementProperty: 'color',
										override: {
											isExpression: false,
											value: colorRed,
										},
									},
								],
							},
						],
					}

					return presetId
				}

				const createMeDskSourcePreset = (meNumber, sourceChoice) => {
					const headerText = `M/E${meNumber} DSK`
					const presetId = `me${meNumber}Dsk${String(sourceChoice.id).replace(/[^A-Za-z0-9]/g, '')}`

					presets[presetId] = {
						type: 'layered',
						name: `M/E${meNumber} DSK - ${sourceChoice.label}`,
						canvas: {
							decoration: { isExpression: false, value: 'none' },
						},
						elements: [
							{
								type: 'box',
								id: 'background',
								x: { isExpression: false, value: 0 },
								y: { isExpression: false, value: 0 },
								width: { isExpression: false, value: 100 },
								height: { isExpression: false, value: 100 },
								color: { isExpression: false, value: colorBlack },
							},
							{
								type: 'text',
								id: 'header',
								name: 'Text',
								x: { isExpression: false, value: 4 },
								y: { isExpression: false, value: 4 },
								width: { isExpression: false, value: 92 },
								height: { isExpression: false, value: 34 },
								text: { isExpression: false, value: headerText },
								fontsize: { isExpression: false, value: 38 },
								fontsizeAllowShrink: { isExpression: false, value: true },
								font: { isExpression: false, value: 'companion-sans' },
								color: { isExpression: false, value: colorWhite },
								halign: { isExpression: false, value: 'center' },
								valign: { isExpression: false, value: 'top' },
							},
							{
								type: 'text',
								id: 'source',
								name: 'Text2',
								x: { isExpression: false, value: 2 },
								y: { isExpression: false, value: 15 },
								width: { isExpression: false, value: 96 },
								height: { isExpression: false, value: 83 },
								text: {
									isExpression: false,
									value: getSourceButtonText(sourceChoice.id),
								},
								fontsize: {
									isExpression: false,
									value: sourceChoice.id === 'Black' ? 39 : 120,
								},
								fontsizeAllowShrink: { isExpression: false, value: true },
								font: { isExpression: false, value: 'companion-sans' },
								color: { isExpression: false, value: colorWhite },
								halign: { isExpression: false, value: 'center' },
								valign: { isExpression: false, value: 'center' },
							},
						],
						steps: [
							{
								down: [
									{
										actionId: 'setMeDskSource',
										options: {
											me: String(meNumber),
											source: sourceChoice.id,
										},
									},
								],
								up: [],
							},
						],
						feedbacks: [
							{
								feedbackId: 'meDskSourceSelected',
								options: {
									me: String(meNumber),
									source: sourceChoice.id,
								},
								styleOverrides: [
									{
										elementId: 'background',
										elementProperty: 'color',
										override: {
											isExpression: false,
											value: colorRed,
										},
									},
								],
							},
						],
					}

					return presetId
				}

				const createMeDskTransitionPreset = (meNumber, transition) => {
					const headerText = `M/E${meNumber} DSK`
					const transitionText = transition === 'cut' ? 'CUT' : 'AUTO'
					const presetId = `me${meNumber}Dsk${transitionText}`

					presets[presetId] = {
						type: 'layered',
						name: `M/E${meNumber} DSK - ${transitionText}`,
						canvas: {
							decoration: { isExpression: false, value: 'none' },
						},
						elements: [
							{
								type: 'box',
								id: 'background',
								x: { isExpression: false, value: 0 },
								y: { isExpression: false, value: 0 },
								width: { isExpression: false, value: 100 },
								height: { isExpression: false, value: 100 },
								color: { isExpression: false, value: colorBlack },
							},
							{
								type: 'text',
								id: 'header',
								name: 'Text',
								x: { isExpression: false, value: 4 },
								y: { isExpression: false, value: 4 },
								width: { isExpression: false, value: 92 },
								height: { isExpression: false, value: 34 },
								text: { isExpression: false, value: headerText },
								fontsize: { isExpression: false, value: 38 },
								fontsizeAllowShrink: { isExpression: false, value: true },
								font: { isExpression: false, value: 'companion-sans' },
								color: { isExpression: false, value: colorWhite },
								halign: { isExpression: false, value: 'center' },
								valign: { isExpression: false, value: 'top' },
							},
							{
								type: 'text',
								id: 'source',
								name: 'Text2',
								x: { isExpression: false, value: 2 },
								y: { isExpression: false, value: 15 },
								width: { isExpression: false, value: 96 },
								height: { isExpression: false, value: 83 },
								text: { isExpression: false, value: transitionText },
								fontsize: {
									isExpression: false,
									value: transition === 'auto' ? 47 : 120,
								},
								fontsizeAllowShrink: { isExpression: false, value: true },
								font: { isExpression: false, value: 'companion-sans' },
								color: { isExpression: false, value: colorWhite },
								halign: { isExpression: false, value: 'center' },
								valign: { isExpression: false, value: 'center' },
							},
						],
						steps: [
							{
								down: [
									{
										actionId: 'meDskTransition',
										options: {
											me: String(meNumber),
											transition,
										},
									},
								],
								up: [],
							},
						],
						feedbacks: [
							{
								feedbackId: 'meDskOnAir',
								options: {
									me: String(meNumber),
								},
								styleOverrides: [
									{
										elementId: 'background',
										elementProperty: 'color',
										override: {
											isExpression: false,
											value: colorRed,
										},
									},
								],
							},
						],
					}

					return presetId
				}
				
				const createOutput2SourcePreset = (sourceChoice) => {
					const presetId = `output2${String(sourceChoice.id).replace(/[^A-Za-z0-9]/g, '')}`

					presets[presetId] = {
						type: 'layered',
						name: `Output 2 - ${sourceChoice.label}`,
						canvas: {
							decoration: { isExpression: false, value: 'none' },
						},
						elements: [
							{
								type: 'box',
								id: 'background',
								x: { isExpression: false, value: 0 },
								y: { isExpression: false, value: 0 },
								width: { isExpression: false, value: 100 },
								height: { isExpression: false, value: 100 },
								color: { isExpression: false, value: colorBlack },
							},
							{
								type: 'text',
								id: 'header',
								name: 'Text',
								x: { isExpression: false, value: 4 },
								y: { isExpression: false, value: 4 },
								width: { isExpression: false, value: 92 },
								height: { isExpression: false, value: 34 },
								text: { isExpression: false, value: 'OUTPUT 2' },
								fontsize: { isExpression: false, value: 38 },
								fontsizeAllowShrink: { isExpression: false, value: true },
								font: { isExpression: false, value: 'companion-sans' },
								color: { isExpression: false, value: colorWhite },
								halign: { isExpression: false, value: 'center' },
								valign: { isExpression: false, value: 'top' },
							},
							{
								type: 'text',
								id: 'source',
								name: 'Text2',
								x: { isExpression: false, value: 2 },
								y: { isExpression: false, value: 15 },
								width: { isExpression: false, value: 96 },
								height: { isExpression: false, value: 83 },
								text: {
									isExpression: false,
									value: getSourceButtonText(sourceChoice.id),
								},
								fontsize: {
									isExpression: false,
									value: sourceChoice.id === 'Black' ? 39 : 120,
								},
								fontsizeAllowShrink: { isExpression: false, value: true },
								font: { isExpression: false, value: 'companion-sans' },
								color: { isExpression: false, value: colorWhite },
								halign: { isExpression: false, value: 'center' },
								valign: { isExpression: false, value: 'center' },
							},
						],
						steps: [
							{
								down: [
									{
										actionId: 'setOutput2Source',
										options: {
											source: sourceChoice.id,
										},
									},
								],
								up: [],
							},
						],
						feedbacks: [
							{
								feedbackId: 'output2SourceSelected',
								options: {
									source: sourceChoice.id,
								},
								styleOverrides: [
									{
										elementId: 'background',
										elementProperty: 'color',
										override: {
											isExpression: false,
											value: colorRed,
										},
									},
								],
							},
						],
					}

					return presetId
				}
				
				const createRegressionPreset = ({
					presetId,
					name,
					headerText,
					buttonText,
					buttonTextSize = 47,
					actions = [],
					feedbacks = [],
				}) => {
					presets[presetId] = {
						type: 'layered',
						name,
						canvas: {
							decoration: { isExpression: false, value: 'none' },
						},
						elements: [
							{
								type: 'box',
								id: 'background',
								x: { isExpression: false, value: 0 },
								y: { isExpression: false, value: 0 },
								width: { isExpression: false, value: 100 },
								height: { isExpression: false, value: 100 },
								color: { isExpression: false, value: colorBlack },
							},
							{
								type: 'text',
								id: 'header',
								name: 'Text',
								x: { isExpression: false, value: 4 },
								y: { isExpression: false, value: 4 },
								width: { isExpression: false, value: 92 },
								height: { isExpression: false, value: 34 },
								text: { isExpression: false, value: headerText },
								fontsize: { isExpression: false, value: 38 },
								fontsizeAllowShrink: { isExpression: false, value: true },
								font: { isExpression: false, value: 'companion-sans' },
								color: { isExpression: false, value: colorWhite },
								halign: { isExpression: false, value: 'center' },
								valign: { isExpression: false, value: 'top' },
							},
							{
								type: 'text',
								id: 'source',
								name: 'Text2',
								x: { isExpression: false, value: 2 },
								y: { isExpression: false, value: 15 },
								width: { isExpression: false, value: 96 },
								height: { isExpression: false, value: 83 },
								text: { isExpression: false, value: buttonText },
								fontsize: { isExpression: false, value: buttonTextSize },
								fontsizeAllowShrink: { isExpression: false, value: true },
								font: { isExpression: false, value: 'companion-sans' },
								color: { isExpression: false, value: colorWhite },
								halign: { isExpression: false, value: 'center' },
								valign: { isExpression: false, value: 'center' },
							},
						],
						steps: [
							{
								down: actions,
								up: [],
							},
						],
						feedbacks,
					}

					return presetId
				}

				const programDefinitions = [
					...PROGRAM_SOURCE_CHOICES.map((sourceChoice) =>
						createSourcePreset('program', sourceChoice)
					),
					createProgramTransitionPreset('auto'),
					createProgramTransitionPreset('cut'),
				]

                const previewDefinitions = PROGRAM_SOURCE_CHOICES.map((sourceChoice) =>
                        createSourcePreset('preview', sourceChoice)
                )
				
				const pgmDsk1Definitions = [
					...DSK_SOURCE_CHOICES.map((sourceChoice) =>
						createProgramDskSourcePreset(1, sourceChoice)
					),
					createProgramDskTransitionPreset(1, 'auto'),
					createProgramDskTransitionPreset(1, 'cut'),
				]

				const pgmDsk2Definitions = [
					...DSK_SOURCE_CHOICES.map((sourceChoice) =>
						createProgramDskSourcePreset(2, sourceChoice)
					),
					createProgramDskTransitionPreset(2, 'auto'),
					createProgramDskTransitionPreset(2, 'cut'),
				]
				
				const meStructures = ME_CHOICES.map((meChoice) => {
					const meNumber = String(meChoice.id)

					const rowADefinitions = ME_SOURCE_CHOICES.map((sourceChoice) =>
						createMeRowSourcePreset(meNumber, 'a', sourceChoice)
					)

					const rowBDefinitions = ME_SOURCE_CHOICES.map((sourceChoice) =>
						createMeRowSourcePreset(meNumber, 'b', sourceChoice)
					)

					const dskDefinitions = [
						...DSK_SOURCE_CHOICES.map((sourceChoice) =>
							createMeDskSourcePreset(meNumber, sourceChoice)
						),
						createMeDskTransitionPreset(meNumber, 'auto'),
						createMeDskTransitionPreset(meNumber, 'cut'),
					]

					return {
						id: `me${meNumber}`,
						name: `M/E${meNumber}`,
						definitions: [
							{
								id: `me${meNumber}-row-a`,
								type: 'simple',
								name: 'Row A',
								presets: rowADefinitions,
							},
							{
								id: `me${meNumber}-row-b`,
								type: 'simple',
								name: 'Row B',
								presets: rowBDefinitions,
							},
							{
								id: `me${meNumber}-dsk-source`,
								type: 'simple',
								name: 'DSK Source',
								presets: dskDefinitions,
							},
						],
					}
				})
				
				const output2Definitions = OUTPUT_CHOICES.map((sourceChoice) =>
					createOutput2SourcePreset(sourceChoice)
				)
				
				const liveSafeMe1Definitions = [
					'me1AInput1',
					'me1BInput1',
					'me1DskInput1',
					'me1DskBFR1',
					'me1DskBFR15',
					'me1DskAUTO',
					'me1DskCUT',
				]
				
				const liveSafeVariableDefinitions = [
					createRegressionPreset({
						presetId: 'regressionVarMe1A',
						name: 'Regression - M/E1 Row A Variable',
						headerText: 'M/E1 A VAR',
						buttonText: `$(${self.label}:v1_a_row_named_input)`,
						buttonTextSize: 38,
					}),
					createRegressionPreset({
						presetId: 'regressionVarPgmDsk1',
						name: 'Regression - Program DSK 1 Source Variable',
						headerText: 'PGM DSK VAR',
						buttonText: `$(${self.label}:main_dsk1_select_named_input)`,
						buttonTextSize: 38,
					}),
					createRegressionPreset({
						presetId: 'regressionVarMe1Dsk',
						name: 'Regression - M/E1 DSK Source Variable',
						headerText: 'M/E1 DSK VAR',
						buttonText: `$(${self.label}:v1_dsk1_select_named_input)`,
						buttonTextSize: 38,
					}),
				]
				
				const liveSafeTallyDefinitions = [
					createRegressionPreset({
						presetId: 'regressionTallyProgramInput1',
						name: 'Regression - Program Tally Input 1',
						headerText: 'PGM TALLY',
						buttonText: '1',
						buttonTextSize: 120,
						feedbacks: [
							{
								feedbackId: 'tallySourceOnProgramPreview',
								options: {
									tally: 'program',
									source: 'Input1',
								},
								styleOverrides: [
									{
										elementId: 'background',
										elementProperty: 'color',
										override: {
											isExpression: false,
											value: colorRed,
										},
									},
								],
							},
						],
					}),
					createRegressionPreset({
						presetId: 'regressionTallyPreviewInput1',
						name: 'Regression - Preview Tally Input 1',
						headerText: 'PVW TALLY',
						buttonText: '1',
						buttonTextSize: 120,
						feedbacks: [
							{
								feedbackId: 'tallySourceOnProgramPreview',
								options: {
									tally: 'preview',
									source: 'Input1',
								},
								styleOverrides: [
									{
										elementId: 'background',
										elementProperty: 'color',
										override: {
											isExpression: false,
											value: colorGreen,
										},
									},
								],
							},
						],
					}),
				]
				
				const liveSafeAdvancedFeedbackDefinitions = [
					createRegressionPreset({
						presetId: 'regressionAdvancedEqualsMatch',
						name: 'Regression - Advanced Equals Match',
						headerText: 'ADV EQ',
						buttonText: 'MATCH',
						buttonTextSize: 47,
						actions: [
							{
								actionId: 'setMeSource',
								options: {
									me: '1',
									row: 'a',
									source: 'Input1',
								},
							},
						],
						feedbacks: [
							{
								feedbackId: 'shortcutStateEquals',
								options: {
									stateName: 'v1_a_row_named_input',
									expectedValue: 'Input1',
								},
								styleOverrides: [
									{
										elementId: 'background',
										elementProperty: 'color',
										override: {
											isExpression: false,
											value: colorGreen,
										},
									},
								],
							},
						],
					}),
					createRegressionPreset({
						presetId: 'regressionAdvancedEqualsNoMatch',
						name: 'Regression - Advanced Equals No Match',
						headerText: 'ADV EQ',
						buttonText: 'NO MATCH',
						buttonTextSize: 38,
						actions: [
							{
								actionId: 'setMeSource',
								options: {
									me: '1',
									row: 'a',
									source: 'Input1',
								},
							},
						],
						feedbacks: [
							{
								feedbackId: 'shortcutStateEquals',
								options: {
									stateName: 'v1_a_row_named_input',
									expectedValue: 'Input2',
								},
								styleOverrides: [
									{
										elementId: 'background',
										elementProperty: 'color',
										override: {
											isExpression: false,
											value: colorRed,
										},
									},
								],
							},
						],
					}),
					createRegressionPreset({
						presetId: 'regressionAdvancedMultipleAnd',
						name: 'Regression - Advanced Multiple AND',
						headerText: 'ADV MULTI',
						buttonText: 'AND',
						actions: [
							{
								actionId: 'setMeSource',
								options: {
									me: '1',
									row: 'a',
									source: 'Input1',
								},
							},
							{
								actionId: 'setMeSource',
								options: {
									me: '1',
									row: 'b',
									source: 'Input2',
								},
							},
						],
						feedbacks: [
							{
								feedbackId: 'shortcutStatesMultiple',
								options: {
									logic: 'and',
									stateName1: 'v1_a_row_named_input',
									comparison1: 'equals',
									expectedValue1: 'Input1',
									stateName2: 'v1_b_row_named_input',
									comparison2: 'equals',
									expectedValue2: 'Input2',
									stateName3: '',
									comparison3: 'equals',
									expectedValue3: '',
									stateName4: '',
									comparison4: 'equals',
									expectedValue4: '',
								},
								styleOverrides: [
									{
										elementId: 'background',
										elementProperty: 'color',
										override: {
											isExpression: false,
											value: colorGreen,
										},
									},
								],
							},
						],
					}),
					createRegressionPreset({
						presetId: 'regressionAdvancedMultipleOr',
						name: 'Regression - Advanced Multiple OR',
						headerText: 'ADV MULTI',
						buttonText: 'OR',
						actions: [
							{
								actionId: 'setMeSource',
								options: {
									me: '1',
									row: 'a',
									source: 'Input1',
								},
							},
							{
								actionId: 'setMeSource',
								options: {
									me: '1',
									row: 'b',
									source: 'Input2',
								},
							},
						],
						feedbacks: [
							{
								feedbackId: 'shortcutStatesMultiple',
								options: {
									logic: 'or',
									stateName1: 'v1_a_row_named_input',
									comparison1: 'equals',
									expectedValue1: 'Input2',
									stateName2: 'v1_b_row_named_input',
									comparison2: 'equals',
									expectedValue2: 'Input2',
									stateName3: '',
									comparison3: 'equals',
									expectedValue3: '',
									stateName4: '',
									comparison4: 'equals',
									expectedValue4: '',
								},
								styleOverrides: [
									{
										elementId: 'background',
										elementProperty: 'color',
										override: {
											isExpression: false,
											value: colorGreen,
										},
									},
								],
							},
						],
					}),
					createRegressionPreset({
						presetId: 'regressionAdvancedNotEqual',
						name: 'Regression - Advanced Not Equal',
						headerText: 'ADV MULTI',
						buttonText: 'NOT EQ',
						actions: [
							{
								actionId: 'setMeSource',
								options: {
									me: '1',
									row: 'a',
									source: 'Input1',
								},
							},
						],
						feedbacks: [
							{
								feedbackId: 'shortcutStatesMultiple',
								options: {
									logic: 'and',
									stateName1: 'v1_a_row_named_input',
									comparison1: 'notEquals',
									expectedValue1: 'Input2',
									stateName2: '',
									comparison2: 'equals',
									expectedValue2: '',
									stateName3: '',
									comparison3: 'equals',
									expectedValue3: '',
									stateName4: '',
									comparison4: 'equals',
									expectedValue4: '',
								},
								styleOverrides: [
									{
										elementId: 'background',
										elementProperty: 'color',
										override: {
											isExpression: false,
											value: colorGreen,
										},
									},
								],
							},
						],
					}),
				]
				
				
				
				const doNotUseProgramPreviewDefinitions = [
					'programInput1',
					'programV1',
					'programAUTO',
					'programCUT',
					'previewInput1',
					'previewV1',
				]
				
				const doNotUseProgramDskDefinitions = [
					'pgmDsk1Input1',
					'pgmDsk1BFR1',
					'pgmDsk1BFR15',
					'pgmDsk1AUTO',
					'pgmDsk1CUT',
					'pgmDsk2Input1',
					'pgmDsk2BFR1',
					'pgmDsk2BFR15',
					'pgmDsk2AUTO',
					'pgmDsk2CUT',
				]
				
				const doNotUseOutput2Definitions = [
					'output2Input1',
					'output2V1',
					'output2preview',
					'output2program',
					'output2programclean',
					'output2BFR1',
					'output2BFR15',
				]

                const structure = [
                        {
                                id: 'program',
                                name: 'Program',
                                definitions: programDefinitions,
                        },
                        {
                                id: 'preview',
                                name: 'Preview',
                                definitions: previewDefinitions,
                        },
						{
                                id: 'pgmDsk1',
                                name: 'Pgm DSK 1',
                                definitions: pgmDsk1Definitions,
                        },
                        {
                                id: 'pgmDsk2',
                                name: 'Pgm DSK 2',
                                definitions: pgmDsk2Definitions,
                        },
						...meStructures,
						{
							id: 'output2',
							name: 'Output 2',
							definitions: output2Definitions,
						},
						{
							id: 'regression-live-safe',
							name: 'Regression Testing (Live Safe)',
							definitions: [
								{
									id: 'regression-live-safe-me1',
									type: 'simple',
									name: 'M/E1 Controls',
									presets: liveSafeMe1Definitions,
								},
								{
									id: 'regression-live-safe-variables',
									type: 'simple',
									name: 'Variables',
									presets: liveSafeVariableDefinitions,
								},
								{
									id: 'regression-live-safe-tally',
									type: 'simple',
									name: 'Tally',
									presets: liveSafeTallyDefinitions,
								},
								{
									id: 'regression-live-safe-advanced-feedbacks',
									type: 'simple',
									name: 'Advanced Feedbacks',
									presets: liveSafeAdvancedFeedbackDefinitions,
								},
							],
						},
						{
							id: 'regression-do-not-use-live',
							name: 'Regression Testing (DO NOT USE WHILE LIVE)',
							definitions: [
								{
									id: 'regression-do-not-use-live-program-preview',
									type: 'simple',
									name: 'Program / Preview',
									presets: doNotUseProgramPreviewDefinitions,
								},
								{
									id: 'regression-do-not-use-live-program-dsk',
									type: 'simple',
									name: 'Program DSK',
									presets: doNotUseProgramDskDefinitions,
								},
								{
									id: 'regression-do-not-use-live-output2',
									type: 'simple',
									name: 'Output 2',
									presets: doNotUseOutput2Definitions,
								},
							],
						},
                ]

                self.setPresetDefinitions(structure, presets)
        },
}