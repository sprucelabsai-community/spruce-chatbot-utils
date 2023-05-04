import { MercuryClient } from '@sprucelabs/mercury-client'
import { assertOptions } from '@sprucelabs/schema'
import { Chatbot } from './chatbot.types'
import ChatbotImpl, { ChatbotOptions } from './ChatbotImpl'

export default class ChatBotFactory {
	public static ChatbotClass?: {
		Chatbot: (options: ChatbotOptions) => Promise<Chatbot>
	}

	protected constructor(private client: MercuryClient) {}

	public static async Factory(options: FactoryOptions) {
		const { client } = assertOptions(options, ['client'])
		return new this(client)
	}

	public static reset() {
		delete this.ChatbotClass
	}

	public async Chatbot(options: ChatbotFromFactoryOptions): Promise<Chatbot> {
		assertOptions(options, ['yourJobIfYouChooseToAcceptItIs', 'weAreDoneWhen'])
		return (ChatBotFactory.ChatbotClass ?? ChatbotImpl).Chatbot({
			...options,
			client: this.client,
		})
	}
}
interface FactoryOptions {
	client: MercuryClient
}

export type ChatbotFromFactoryOptions = Omit<ChatbotOptions, 'client'>
