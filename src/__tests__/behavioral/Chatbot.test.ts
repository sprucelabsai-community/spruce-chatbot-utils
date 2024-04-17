import { buildSchema } from '@sprucelabs/schema'
import { fake } from '@sprucelabs/spruce-test-fixtures'
import { test, assert, errorAssert, generateId } from '@sprucelabs/test-utils'
import ChatbotImpl, { ChatbotOptions } from '../../ChatbotImpl'
import AbstractChatbotTest from '../support/AbstractChatbotTest'

@fake.login()
export default class ChatbotTest extends AbstractChatbotTest {
    private static randomOptions: ChatbotOptions

    protected static async beforeEach() {
        await super.beforeEach()
        this.randomOptions = {
            client: this.fakedClient,
            yourJobIfYouChooseToAcceptItIs: generateId(),
            title: generateId(),
            weAreDoneWhen: generateId(),
            pleaseKeepInMindThat: [generateId(), generateId()],
        }
    }

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
        assert.isInstanceOf(bot, ChatbotImpl as any)
    }

    @test()
    protected static async eachBotListensForRegisterChatbotsEvent() {
        await this.Chatbot()
        await this.assertTotalBotsRegistered(1)
        await this.Chatbot()
        await this.assertTotalBotsRegistered(2)
    }

    @test()
    protected static async botRegistersWithCorrectData() {
        const options: ChatbotOptions = {
            ...this.randomOptions,
            stateSchema: buildSchema({
                id: 'test',
                fields: {
                    firstName: {
                        type: 'text',
                        isRequired: true,
                    },
                },
            }),
        }

        await this.Chatbot(options)

        const [bot] = await this.getRegisteredBots()
        assert.doesInclude(options, bot)
    }

    private static async assertTotalBotsRegistered(expected: number) {
        const bots = await this.getRegisteredBots()
        assert.isLength(bots, expected)
    }

    protected static async Chatbot(options?: Partial<ChatbotOptions>) {
        return await ChatbotImpl.Chatbot({
            ...this.randomOptions,
            ...options,
        })
    }
}
