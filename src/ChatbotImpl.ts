import { MercuryClient } from '@sprucelabs/mercury-client'
import { assertOptions } from '@sprucelabs/schema'
import { SkillOptions } from '@sprucelabs/sprucebot-llm'

export default class ChatbotImpl {
	protected constructor() {}

	public static async Chatbot(options: ChatbotOptions) {
		assertOptions(options, [
			'title',
			'yourJobIfYouChooseToAcceptItIs',
			'weAreDoneWhen',
			'client',
		])

		return new this()
	}
}

export interface ChatbotOptions extends SkillOptions {
	title: string
	client: MercuryClient
	weAreDoneWhen: string
}
