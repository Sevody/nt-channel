import { Module } from '@nestjs/common';
import { UserModule } from 'modules/user/user.module';
import { RSSbotController } from './rssbot.controller';
import { RSSbotService } from './rssbot.services';

@Module({
    imports: [UserModule],
    controllers: [RSSbotController],
    providers: [RSSbotService],
})
export class RSSbotModule {}
