import { Injectable } from '@nestjs/common';
import { LineContext, MessengerTypes } from 'bottender';
import { ResponseService } from './response.service';

@Injectable()
export class ValidationService {
    constructor(private readonly responseService: ResponseService) {}

    validateMessage = (
        context: LineContext,
        locale: string,
    ): MessengerTypes.TextMessage => {
        if (!context.state.current_state) {
            return this.responseService.getDefaultResponse(locale);
        }
    };
}
