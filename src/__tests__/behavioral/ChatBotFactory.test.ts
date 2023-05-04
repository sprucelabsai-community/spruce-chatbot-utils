import { fake } from '@sprucelabs/spruce-test-fixtures'
import { test, assert, errorAssert, generateId } from '@sprucelabs/test-utils'
import { Chatbot } from '../../chatbot.types'
import ChatBotFactory, { ChatbotFromFactoryOptions } from '../../ChatBotFactory'
import ChatbotImpl, { ChatbotOptions } from '../../ChatbotImpl'
import AbstractChatbotTest from '../support/AbstractChatbotTest'

@fake.login()
export default class ChatBotFactoryTest extends AbstractChatbotTest {
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
		const bot = await this.Chatbot()
		assert.isInstanceOf(bot, ChatbotImpl as any)
	}

	@test()
	protected static async makeSureAllOptionsArePassedThrough() {
		const options: ChatbotFromFactoryOptions = {
			title: generateId(),
			weAreDoneWhen: generateId(),
			yourJobIfYouChooseToAcceptItIs: generateId(),
		}
		ChatBotFactory.ChatbotClass = SpyBot
		const bot = (await this.Chatbot(options)) as SpyBot
		assert.isInstanceOf(bot, SpyBot)
		assert.doesInclude(bot.constructorOptions, options)
	}
}

class SpyBot implements Chatbot {
	public constructorOptions: ChatbotOptions

	public constructor(options: ChatbotOptions) {
		this.constructorOptions = options
	}

	public static async Chatbot(options: ChatbotOptions) {
		return new this(options)
	}
}
