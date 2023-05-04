import { AbstractSpruceFixtureTest } from '@sprucelabs/spruce-test-fixtures'
import { generateId } from '@sprucelabs/test-utils'
import { RegisteredChatbot } from '../../chatbot.types'
import ChatBotFactory, { ChatbotFromFactoryOptions } from '../../ChatBotFactory'

export default abstract class AbstractChatbotTest extends AbstractSpruceFixtureTest {
	protected static bots: ChatBotFactory

	protected static async beforeEach(): Promise<void> {
		await super.beforeEach()
		ChatBotFactory.reset()
		this.bots = await ChatBotFactory.Factory({
			client: this.fakedClient,
		})
	}

	protected static async Chatbot(options?: Partial<ChatbotFromFactoryOptions>) {
		return await this.bots.Chatbot({
			title: generateId(),
			weAreDoneWhen: generateId(),
			yourJobIfYouChooseToAcceptItIs: generateId(),
			...options,
		})
	}

	protected static async getRegisteredBots(): Promise<RegisteredChatbot[]> {
		const results = await this.fakedClient.emitAndFlattenResponses(
			'register-chatbots::v2020_12_25'
		)

		const bots: RegisteredChatbot[] = []
		results.forEach((r) => bots.push(...r.bots))
		return bots
	}
}
