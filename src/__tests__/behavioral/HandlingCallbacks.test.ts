import { fake } from '@sprucelabs/spruce-test-fixtures'
import { test, assert, generateId } from '@sprucelabs/test-utils'
import AbstractChatbotTest from '../support/AbstractChatbotTest'

@fake.login()
export default class HandlingCallbacksTest extends AbstractChatbotTest {
	@test()
	protected static async mapsCallbacksToRegisteredForm() {
		const useThisWhenever = generateId()
		const useThisWhenever2 = generateId()

		await this.Chatbot({
			callbacks: {
				test: {
					cb: async () => '',
					useThisWhenever,
				},
				test2: {
					cb: async () => '',
					useThisWhenever: useThisWhenever2,
				},
			},
		})

		const [bot] = await this.getRegisteredBots()
		assert.isEqualDeep(bot.callbacks, [
			{
				placeholder: 'test',
				useThisWhenever,
			},
			{
				placeholder: 'test2',
				useThisWhenever: useThisWhenever2,
			},
		])
	}
}
