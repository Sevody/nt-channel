import { Injectable } from '@nestjs/common';
import { LineContext, MessengerTypes } from 'bottender';
import { getUserOptions } from 'common/utils';
import { UserService } from 'modules/user/user.service';
import { ResolverService } from './resolver.service';

@Injectable()
export class LocationService {
    constructor(
        private readonly resolverService: ResolverService,
        private readonly userService: UserService,
    ) {}

    handleLocation = async (
        context: LineContext,
    ): Promise<MessengerTypes.TextMessage> => {
        const userOptions = getUserOptions(context);
        const locale = await this.userService.getLocale(userOptions);

        if (!context.state.current_state) {
            return this.resolverService.getDefaultResponse(locale);
        }

        context.resetState();
        return this.resolverService.getDefaultResponse(locale);
    };
}
