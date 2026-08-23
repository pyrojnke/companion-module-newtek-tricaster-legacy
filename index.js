const { InstanceBase, InstanceStatus, runEntrypoint } = require('@companion-module/base')
const net = require('net')

const config = require('./src/config')
const feedbacks = require('./src/feedbacks')
const variables = require('./src/variables')
const actions = require('./src/actions')

class TriCasterLegacyInstance extends InstanceBase {
	constructor(internal) {
		super(internal)

		Object.assign(this, {
			...config,
			...feedbacks,
			...variables,
			...actions,
		})

		this.socket = null
		this.reconnectTimer = null
		this.isDestroying = false

		this.shortcutStates = {}
		this.receiveBuffer = ''
	}

	async init(config) {
		this.config = config

		this.initFeedbacks()
		this.initVariables()
		this.initActions()
		this.initConnection()
	}

	async configUpdated(config) {
		this.config = config
		this.initConnection()
	}

	async destroy() {
		this.isDestroying = true

		if (this.reconnectTimer) {
			clearTimeout(this.reconnectTimer)
			this.reconnectTimer = null
		}

		if (this.socket) {
			this.socket.removeAllListeners()
			this.socket.destroy()
			this.socket = null
		}
	}

	initConnection() {
		if (this.reconnectTimer) {
			clearTimeout(this.reconnectTimer)
			this.reconnectTimer = null
		}

		if (this.socket) {
			this.socket.removeAllListeners()
			this.socket.destroy()
			this.socket = null
		}

		if (!this.config.host) {
			this.updateStatus(InstanceStatus.BadConfig, 'TriCaster IP address is required')
			return
		}

		this.updateStatus(InstanceStatus.Connecting)

		if (this.config.verbose) {
			this.log('debug', `Connecting to TriCaster ${this.config.host}:5951`)
		}

		const socket = net.createConnection({
			host: this.config.host,
			port: 5951,
		})

		this.socket = socket

		socket.setKeepAlive(true)

		socket.on('connect', () => {
			if (socket !== this.socket) {
				return
			}

			this.updateStatus(InstanceStatus.Ok)
			this.log('info', `Connected to TriCaster at ${this.config.host}:5951`)

			const registration = '<register name="NTK_states"/>\n'
			socket.write(registration)

			if (this.config.verbose) {
				this.log('debug', 'Registered for NTK_states')
			}
		})

		socket.on('data', (data) => {
			if (socket !== this.socket) {
				return
			}

			const text = data.toString('utf8')

			if (this.config.verbose) {
				this.log('debug', `TriCaster data: ${text}`)
			}

			this.processTriCasterData(text)
		})

		socket.on('error', (error) => {
			if (socket !== this.socket) {
				return
			}

			this.log('error', `TriCaster connection error: ${error.message}`)
			this.updateStatus(InstanceStatus.ConnectionFailure, error.message)
		})

		socket.on('close', () => {
			if (socket !== this.socket) {
				return
			}

			this.socket = null

			if (this.isDestroying) {
				return
			}

			this.updateStatus(InstanceStatus.Disconnected, 'Connection closed')
			this.log('warn', 'TriCaster connection closed. Reconnecting in 5 seconds.')

			this.reconnectTimer = setTimeout(() => {
				this.reconnectTimer = null
				this.initConnection()
			}, 5000)
		})
	}
	
	processTriCasterData(data) {
		this.receiveBuffer += data

		// Prevent an unexpected response from allowing the buffer
		// to grow indefinitely.
		if (this.receiveBuffer.length > 1000000) {
			this.log('warn', 'TriCaster receive buffer exceeded 1 MB. Resetting buffer.')
			this.receiveBuffer = ''
			return
		}

		const stateRegex = /<shortcut_state\s+([^>]*?)\/>/g
		const attributeRegex = /(\w+)="([^"]*)"/g

		let match
		let lastProcessedIndex = 0
		let stateChanged = false

		while ((match = stateRegex.exec(this.receiveBuffer)) !== null) {
			const attributes = {}
			let attributeMatch

			while ((attributeMatch = attributeRegex.exec(match[1])) !== null) {
				attributes[attributeMatch[1]] = attributeMatch[2]
			}

			if (attributes.name !== undefined && attributes.value !== undefined) {
				const oldValue = this.shortcutStates[attributes.name]
				const newValue = attributes.value

				this.shortcutStates[attributes.name] = newValue

				if (this.variableStates.includes(attributes.name)) {
					this.setVariableValues({
						[attributes.name]: newValue,
					})
				}

				if (oldValue !== newValue) {
					stateChanged = true

					if (this.config.verbose) {
						this.log(
							'debug',
							`State changed: ${attributes.name} = ${newValue}`
						)
					}
				}
			}

			lastProcessedIndex = stateRegex.lastIndex
		}

		if (lastProcessedIndex > 0) {
			this.receiveBuffer = this.receiveBuffer.substring(lastProcessedIndex)
		}

		if (stateChanged) {
			this.checkFeedbacks(
				'programPreviewSourceSelected',
				'programDskOnAir',
				'meRowSourceSelected',
				'meDskSourceSelected',
				'output2SourceSelected',
				'ddrPlaying',
				'tallySourceOnProgramPreview',
				'shortcutStateEquals',
				'shortcutStatesMultiple'
			)
		}
	}
}

runEntrypoint(TriCasterLegacyInstance, [])
