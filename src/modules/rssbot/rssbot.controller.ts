import { Controller, Logger, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RSSbotService } from './rssbot.services';
import { SendRSSMessageDto } from './dto/send-rss-message.dto';
import { BroadcastRSSMessageDto } from './dto/broadcast-rss-message.dto';

@Controller('rssbot')
@ApiTags('rssbot')
export class RSSbotController {
    private readonly logger = new Logger(RSSbotController.name);

    constructor(private readonly rssbotService: RSSbotService) {}

    @Post('send')
    sendMessage(
        @Body() sendRSSMessageDto: SendRSSMessageDto,
    ): Promise<boolean> {
        const result = this.rssbotService.sendMessage(sendRSSMessageDto);
        if (result) {
            this.logger.log(
                `send message: %${sendRSSMessageDto.content}% successed`,
            );
        }
        return result;
    }

    @Post('broadcast')
    broadMessage(
        @Body() broadcastRSSMessageDto: BroadcastRSSMessageDto,
    ): Promise<boolean> {
        const result = this.rssbotService.broadcastMessage(
            broadcastRSSMessageDto,
        );
        if (result) {
            this.logger.log(
                `send message: %${broadcastRSSMessageDto.content}% successed`,
            );
        }
        return result;
    }
}
