import { MercuryClient } from '@sprucelabs/mercury-client'
import { assertOptions } from '@sprucelabs/schema'
import ChatbotImpl, { ChatbotOptions } from './ChatbotImpl'

export default class ChatBotFactory {
	public static async Factory(options: FactoryOptions) {
		assertOptions(options, ['client'])
		return new this()
	}

	public async Chatbot(options: ChatbotOptions) {
		assertOptions(options, ['yourJobIfYouChooseToAcceptItIs', 'weAreDoneWhen'])
		return new ChatbotImpl()
	}
}
interface FactoryOptions {
	client: MercuryClient
}
