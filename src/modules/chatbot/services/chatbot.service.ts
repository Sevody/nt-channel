import { Injectable } from '@nestjs/common';
import { MessengerContext, LineContext } from 'bottender';
import { line, platform, router } from 'bottender/router';
import tunnel from 'tunnel';
import { DEFAULT_MESSENGER_LOCALE } from 'common/config/constants';
// import { getUserOptions } from 'common/utils';
import { GET_STARTED_PAYLOAD } from 'modules/chatbot/chatbot.constants';
import { ChatbotController } from 'modules/chatbot/chatbot.controller';
import { Message } from 'modules/chatbot/chatbot.types';
// import { UserService } from 'modules/user/user.service';
import { ResponseService } from './response.service';

@Injectable()
export class ChatbotService {
    constructor(
        private readonly controller: ChatbotController,
    ) // private readonly responseService: ResponseService,
    // private readonly userService: UserService,
    {}

    private asyncWrap = (fn) => async (context: LineContext) => {
        context.client.axios.defaults.proxy = false;
        context.client.axios.defaults.httpsAgent = tunnel.httpsOverHttp({
            proxy: { host: '127.0.0.1', port: '7890' },
        });
        // this.say(context, 'messagehandle::');
        // const userOptions = getUserOptions(context);
        // const user = await this.userService.validateUser(userOptions);

        // if (!user && context.event.postback?.payload !== GET_STARTED_PAYLOAD) {
        //   const {
        //     locale = DEFAULT_MESSENGER_LOCALE,
        //   } = await context.getUserProfile({ fields: ['locale'] });

        //   const response = await this.responseService.getRegisterUserFailureResponse(
        //     locale,
        //   );
        //   return this.say(context, response);
        // }

        const response = await fn(context);
        return this.say(context, response);
    };

    getRouter = () => router([platform('line', this.handleMessenger)]);


    private handleMessenger = async (context) =>
        router([
            line.message(this.asyncWrap(this.controller.messageHandler)),
            //   messenger.postback(this.asyncWrap(this.controller.postbackHandler)),
        ]);

    private say = async (
        context: LineContext,
        message: Message | Message[],
    ) => {
        const {
            _session: {
                user: { id: recipientId },
            },
        } = context;
        if (typeof message === 'string') {
            await context.sendText(<string>message);
        }
        //  else if (isQuickReplyTemplate(message)) {
        //   return context.client.sendText(recipientId, message.text, {
        //     quickReplies: message.quickReplies,
        //   });
        // } else if (isButtonTemplate(message)) {
        //   return context.client.sendTemplate(recipientId, {
        //     templateType: 'button',
        //     ...message,
        //   });
        // } else if (isGenericTemplate(message)) {
        //   return context.client.sendGenericTemplate(recipientId, message.cards);
        // } else if (Array.isArray(message)) {
        //   return message.reduce((promise, msg) => {
        //     return promise.then(() => this.say(context, msg));
        //   }, Promise.resolve(undefined));
        // }
        // this.logger.error('Invalid format for .say() message.');
    };
}
