import { Controller, Logger } from '@nestjs/common';
import { LineContext, MessengerTypes } from 'bottender';
import {
    DEFAULT_MESSENGER_GENDER,
    DEFAULT_MESSENGER_LOCALE,
} from 'common/config/constants';
import { getUserOptions } from 'common/utils';
import {
    ABOUT_ME_PAYLOAD,
    GET_STARTED_PAYLOAD,
} from 'modules/chatbot/chatbot.constants';
import { LocationService } from './services/location.service';
import { MessageService } from './services/message.service';
import { PostbackService } from './services/postback.service';
import { ResolverService } from './services/resolver.service';

@Controller()
export class ChatbotController {
    private readonly logger = new Logger(ChatbotController.name);

    constructor(
        private readonly locationService: LocationService,
        private readonly messageService: MessageService,
        private readonly postbackService: PostbackService,
        private readonly resolverService: ResolverService,
    ) {}

    private aboutMeHandler = async (context: LineContext) => {
        return await this.resolverService.getAboutMeResponse(context);
    };

    private getStartedButtonHandler = async (context: LineContext) => {
        const {
            displayName: first_name,
            gender = DEFAULT_MESSENGER_GENDER,
            language: locale = DEFAULT_MESSENGER_LOCALE,
            last_name = '',
            pictureUrl: avatar,
        } = await context.getUserProfile();
        const userOptions = getUserOptions(context);
        return await this.resolverService.registerUser(
            {
                ...userOptions,
                first_name,
                gender,
                avatar,
                last_name,
                locale,
            },
            userOptions,
        );
    };

    locationHandler = async (
        context: LineContext,
    ): Promise<MessengerTypes.TextMessage> =>
        this.locationService.handleLocation(context);

    messageHandler = async (context: LineContext) => {
        // const { event } = context;
        // if (event.isLocation) {
        //   return this.locationHandler(context);
        // }
        return this.messageService.handleMessage(context);
    };

    postbackHandler = async (context: LineContext) => {
        const {
            event: {
                postback: { data: buttonPayload },
            },
        } = context;
        if (this.postbackHandlers[buttonPayload])
            return this.postbackHandlers[buttonPayload](context);

        return await this.postbackService.handlePostback(context);
    };

    postbackHandlers = {
        [ABOUT_ME_PAYLOAD]: this.aboutMeHandler,
        [GET_STARTED_PAYLOAD]: this.getStartedButtonHandler,
    };
}
