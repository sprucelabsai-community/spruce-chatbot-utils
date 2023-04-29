import { fake } from '@sprucelabs/spruce-test-fixtures'
import { AbstractSpruceFixtureTest } from '@sprucelabs/spruce-test-fixtures'
import { test, assert, errorAssert, generateId } from '@sprucelabs/test-utils'
import ChatbotImpl from '../../ChatbotImpl'

@fake.login()
export default class ChatbotTest extends AbstractSpruceFixtureTest {
	@test()
	protected static async botThrowsWithoutRequired() {
		//@ts-ignore
		const err = await assert.doesThrowAsync(() => ChatbotImpl.Chatbot())
		errorAssert.assertError(err, 'MISSING_PARAMETERS', {
			parameters: [
				'title',
				'yourJobIfYouChooseToAcceptItIs',
				'weAreDoneWhen',
				'client',
			],
		})
	}

	@test()
	protected static async canCreateWhenHasRequired() {
		const bot = await this.Chatbot()
		assert.isInstanceOf(bot, ChatbotImpl)
	}

	@test()
	protected static async eachBotListensForRegisterChatbotsEvent() {
		const bot = await this.Chatbot()
		const [{ bots }] = await this.fakedClient.emitAndFlattenResponses(
			'register-chat-bots::v2020_12_25'
		)
	}

	private static async Chatbot() {
		return await ChatbotImpl.Chatbot({
			client: this.fakedClient,
			yourJobIfYouChooseToAcceptItIs: generateId(),
			title: generateId(),
			weAreDoneWhen: generateId(),
		})
	}
}
