import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { UserService } from 'modules/user/user.service';
import { SendRSSMessageDto } from './dto/send-rss-message.dto';
import { BroadcastRSSMessageDto } from './dto/broadcast-rss-message.dto';
import { ConfigService } from 'common/config';
import { setAgentProxy } from 'common/utils';
import { LineClient } from 'messaging-api-line';

@Injectable()
export class RSSbotService {
    private readonly logger = new Logger(RSSbotService.name);

    private readonly client: LineClient;

    constructor(
        private readonly userService: UserService,
        private readonly configService: ConfigService,
    ) {
        const client = new LineClient({
            accessToken: this.configService.get('LINE_ACCESS_TOKEN'),
            channelSecret: this.configService.get('LINE_CHANNEL_SECRET'),
        });
        setAgentProxy(client, this.configService);
        this.client = client;
    }

    async sendMessage(sendRSSMessageDto: SendRSSMessageDto): Promise<boolean> {
        try {
            await this.client.pushText(
                sendRSSMessageDto.id,
                sendRSSMessageDto.content,
            );
        } catch (error) {
            this.logger.log(error); // formatted error message
        }
        return true;
    }

    async broadcastMessage(
        broadcastRSSMessageDto: BroadcastRSSMessageDto,
    ): Promise<boolean> {
        try {
            const users = await this.userService.getUsers({});
            const userIds = users.map((user) => user.line_id);
            const task = [];
            userIds.map((id) => {
                task.push(
                    this.client.pushText(id, broadcastRSSMessageDto.content),
                );
            });
            await Promise.all(task);
        } catch (error) {
            this.logger.log(error);
        }
        return true;
    }
}
