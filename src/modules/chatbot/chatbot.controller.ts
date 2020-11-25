import { Controller, Logger } from '@nestjs/common';
import { LineContext } from 'bottender';
import {
  DEFAULT_MESSENGER_GENDER,
  DEFAULT_MESSENGER_LOCALE,
} from 'common/config/constants';
// import { getUserOptions } from 'common/utils';
import {
  ABOUT_ME_PAYLOAD,
  GET_STARTED_PAYLOAD,
} from 'modules/chatbot/chatbot.constants';
import {
  isButtonTemplate,
  isGenericTemplate,
  isQuickReplyTemplate,
} from './chatbot.type-guards';
import { Message } from './chatbot.types';
// import { LocationService } from './services/location.service';
// import { MessageService } from './services/message.service';
// import { PostbackService } from './services/postback.service';
// import { ResolverService } from './services/resolver.service';
import tunnel from 'tunnel';

@Controller()
export class ChatbotController {
  private readonly logger = new Logger(ChatbotController.name);

  constructor(
    // private readonly locationService: LocationService,
    // private readonly messageService: MessageService,
    // private readonly postbackService: PostbackService,
    // private readonly resolverService: ResolverService,
  ) {}

  private aboutMeHandler = async (context: LineContext) => {
    // const response = await this.resolverService.getAboutMeResponse(context);

    // return response;
  };

//   private getStartedButtonHandler = async (context: MessengerContext) => {
//     const {
//       firstName,
//       gender = DEFAULT_MESSENGER_GENDER,
//       lastName,
//       locale = DEFAULT_MESSENGER_LOCALE,
//       profilePic: image_url,
//     } = await context.getUserProfile({
//       fields: [
//         'id',
//         'first_name',
//         'gender',
//         'last_name',
//         'locale',
//         'profile_pic',
//       ],
//     });
//     const userOptions = getUserOptions(context);
//     const response = await this.resolverService.registerUser(
//       {
//         ...userOptions,
//         first_name: firstName,
//         gender,
//         image_url,
//         last_name: lastName,
//         locale,
//       },
//       userOptions,
//     );

//     return this.say(context, response);
//   };

//   locationHandler = async (context: MessengerContext) => {
//     const response = await this.locationService.handleLocation(context);
//     if (!response) return;

//     return this.say(context, response);
//   };

  messageHandler = async (context: LineContext) => {
    // const { event } = context;
    // if (event.isLocation) {
    //   return this.locationHandler(context);
    // }

    // if (this.quickReplyHandlers[event.quickReply?.payload])
    //   return this.quickReplyHandlers[event.quickReply?.payload](context);

    // return this.messageService.handleMessage(context);
    return 'hello kugo';
  };

//   postbackHandler = async (context: MessengerContext) => {
//     const {
//       event: {
//         postback: { payload: buttonPayload },
//       },
//     } = context;

//     if (this.postbackHandlers[buttonPayload])
//       return this.postbackHandlers[buttonPayload](context);

//     const response = await this.postbackService.handlePostback(context);
//     if (!response) return;

//     return this.say(context, response);
//   };

  postbackHandlers = {
    [ABOUT_ME_PAYLOAD]: this.aboutMeHandler,
    // [GET_STARTED_PAYLOAD]: this.getStartedButtonHandler,
  };

  quickReplyHandlers = {
    [ABOUT_ME_PAYLOAD]: this.aboutMeHandler,
  };
}
