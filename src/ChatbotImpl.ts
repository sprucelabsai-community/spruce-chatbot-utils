import { MercuryClient } from '@sprucelabs/mercury-client'
import { assertOptions } from '@sprucelabs/schema'
import { LlmCallbackMap, SkillOptions } from '@sprucelabs/sprucebot-llm'
import { RegisteredCallbacks, RegisteredChatbot } from './chatbot.types'

export default class ChatbotImpl {
	private client: MercuryClient
	private registrationOptions: RegisteredChatbot
	private callbacks: LlmCallbackMap

	protected constructor(options: ChatbotOptions) {
		const { client, callbacks, ...rest } = options
		this.client = client
		this.registrationOptions = rest
		this.callbacks = callbacks ?? {}
	}

	public static async Chatbot(options: ChatbotOptions) {
		assertOptions(options, [
			'title',
			'yourJobIfYouChooseToAcceptItIs',
			'weAreDoneWhen',
			'client',
		])

		const bot = new this(options)
		await bot.register()

		return bot
	}

	private async register() {
		await this.client.on('register-chatbots::v2020_12_25', () => {
			return {
				bots: [this.generateRegisterBotsPayload()],
			}
		})
	}

	private generateRegisterBotsPayload() {
		const callbacks = this.getRegisteredCallbacks()
		const bot = { ...this.registrationOptions }
		if (callbacks) {
			bot.callbacks = callbacks
		}
		return bot
	}

	private getRegisteredCallbacks() {
		const callbackKeys = Object.keys(this.callbacks)
		if (!callbackKeys.length) {
			return undefined
		}

		const callbacks: RegisteredCallbacks[] = []
		for (const key of callbackKeys) {
			const cb = this.callbacks[key]
			callbacks.push({
				placeholder: key,
				useThisWhenever: cb.useThisWhenever,
			})
		}
		return callbacks
	}
}

export interface ChatbotOptions extends SkillOptions {
	title: string
	client: MercuryClient
	weAreDoneWhen: string
}
