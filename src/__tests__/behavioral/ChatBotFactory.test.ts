import { fake } from '@sprucelabs/spruce-test-fixtures'
import { AbstractSpruceFixtureTest } from '@sprucelabs/spruce-test-fixtures'
import { SkillOptions } from '@sprucelabs/sprucebot-llm'
import { test, assert, errorAssert, generateId } from '@sprucelabs/test-utils'
import ChatBotFactory from '../../ChatBotFactory'
import ChatbotImpl from '../../ChatbotImpl'

@fake.login()
export default class ChatBotFactoryTest extends AbstractSpruceFixtureTest {
	private static bots: ChatBotFactory

	protected static async beforeEach(): Promise<void> {
		await super.beforeEach()
		this.bots = await ChatBotFactory.Factory({
			client: this.fakedClient,
		})
	}

	@test()
	protected static async throwsWithMissing() {
		//@ts-ignore
		const err = await assert.doesThrowAsync(() => ChatBotFactory.Factory())
		errorAssert.assertError(err, 'MISSING_PARAMETERS', {
			parameters: ['client'],
		})
	}

	@test()
	protected static async canBuildWithRequired() {
		await ChatBotFactory.Factory({
			client: this.fakedClient,
		})
	}

	@test()
	protected static async botThrowsWithMissing() {
		//@ts-ignore
		const err = await assert.doesThrowAsync(() => this.bots.Chatbot())
		errorAssert.assertError(err, 'MISSING_PARAMETERS', {
			parameters: ['yourJobIfYouChooseToAcceptItIs', 'weAreDoneWhen'],
		})
	}

	@test()
	protected static async canCreateBotWithRequired() {
		const bot = await this.bots.Chatbot({
			weAreDoneWhen: generateId(),
			yourJobIfYouChooseToAcceptItIs: generateId(),
		})
		assert.isInstanceOf(bot, ChatbotImpl)
	}
}
