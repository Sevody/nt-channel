import { Injectable, Logger } from '@nestjs/common';
import { LineContext, getClient, LineBot, Bot, LineConnector } from 'bottender';
import { line, platform, router } from 'bottender/router';
import { DEFAULT_MESSENGER_LOCALE } from 'common/config/constants';
import { getUserOptions, setAgentProxy } from 'common/utils';
// import { GET_STARTED_PAYLOAD } from 'modules/chatbot/chatbot.constants';
import { ChatbotController } from 'modules/chatbot/chatbot.controller';
import {
    // isButtonTemplate,
    // isGenericTemplate,
    isQuickReplyTemplate,
} from 'modules/chatbot/chatbot.type-guards';
import { Message } from 'modules/chatbot/chatbot.types';
import { UserService } from 'modules/user/user.service';
import { ResponseService } from './response.service';
import { ConfigService } from 'common/config';

@Injectable()
export class ChatbotService {
    private readonly logger = new Logger(ChatbotService.name);

    constructor(
        private readonly controller: ChatbotController,
        private readonly responseService: ResponseService,
        private readonly userService: UserService,
        private readonly configService: ConfigService,
    ) {}

    private asyncWrap = (fn) => async (context: LineContext) => {
        setAgentProxy(context, this.configService);
        // const client = context.client;
        // client.axios.defaults.proxy = false;
        // client.axios.defaults.httpsAgent = tunnel.httpsOverHttp({
        //     proxy: { host: '127.0.0.1', port: '7890' },
        // });
        const userOptions = getUserOptions(context);
        const user = await this.userService.validateUser(userOptions);

        if (!user && !context.event.isFollow) {
            const {
                language: locale = DEFAULT_MESSENGER_LOCALE,
            } = await context.getUserProfile();

            const response = await this.responseService.getRegisterUserFailureResponse(
                locale,
            );
            return this.say(context, response);
        }

        const response = await fn(context);
        return this.say(context, response);
    };

    getRouter = () => router([platform('line', this.handleMessenger)]);

    private handleMessenger = async () =>
        router([
            line.message(this.asyncWrap(this.controller.messageHandler)),
            line.postback(this.asyncWrap(this.controller.postbackHandler)),
        ]);

    private say = async (
        context: LineContext,
        message: Message | Message[],
    ) => {
        if (typeof message === 'string') {
            await context.sendText(message);
        } else if (isQuickReplyTemplate(message)) {
            // conver message to line reply format
            const replyItems = message.quickReplies.reduce((result, item) => {
                if (item.contentType === 'text') {
                    result.push({
                        type: 'action',
                        action: {
                            type: 'postback',
                            data: item.payload,
                            label: item.title,
                        },
                    });
                    return result;
                }
            }, []);
            await context.replyText(message.text, {
                quickReply: {
                    items: replyItems,
                },
            });
        } else {
            this.logger.error('Invalid format for .say() message.');
        }
        //   else if (isQuickReplyTemplate(message)) {
        //     return context.replyText(message.text, {
        //         quickReply: {
        //             items: [...message.quickReplies]
        //         },
        //     });
        //   } else if (isButtonTemplate(message)) {
        //     return context.client.sendTemplate(recipientId, {
        //       templateType: 'button',
        //       ...message,
        //     });
        //   } else if (isGenericTemplate(message)) {
        //     return context.client.sendGenericTemplate(recipientId, message.cards);
        //   } else if (Array.isArray(message)) {
        //     return message.reduce((promise, msg) => {
        //       return promise.then(() => this.say(context, msg));
        //     }, Promise.resolve(undefined));
        //   }
    };
}
