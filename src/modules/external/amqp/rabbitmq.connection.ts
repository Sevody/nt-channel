import { DiscoveryService } from '@golevelup/nestjs-discovery';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { AmqpConnectionManager, ChannelWrapper } from 'amqp-connection-manager';
import { ConfirmChannel, Options, Replies } from 'amqplib';

import {
    RABBITMQ_SUBSCRIBE_EXCHANGE_OPTIONS_TOKEN,
    RABBITMQ_SUBSCRIBE_EXCHANGE_ROUTINGKEY_TOKEN,
    RABBITMQ_SUBSCRIBE_QUEUE_OPTIONS_TOKEN,
} from './rabbitmq.constants';
import { IExchangeOption, IQueueOption } from './rabbitmq.options';

@Injectable()
export class RabbitmqConnection implements OnModuleInit {
    private _connection: AmqpConnectionManager;
    private _publishChannels: { [exchange: string]: ChannelWrapper } = {};
    private _logger = new Logger();
    private _hasInit = false;
    constructor(private readonly _discoveryService: DiscoveryService) {}

    setConnection(connection: AmqpConnectionManager) {
        this._connection = connection;
    }

    get connection(): AmqpConnectionManager {
        return this._connection;
    }

    async onModuleInit() {
        if (!this._hasInit) {
            this._hasInit = true;
            await this.registerSubscribe();
        }
    }

    async registerSubscribe() {
        const subscribeMethods = await this._discoveryService.providerMethodsWithMetaAtKey(
            RABBITMQ_SUBSCRIBE_EXCHANGE_OPTIONS_TOKEN,
        );
        for (const method of subscribeMethods) {
            const originalHandler = method.discoveredMethod.handler;

            let exchangeOption: IExchangeOption = Reflect.getMetadata(
                RABBITMQ_SUBSCRIBE_EXCHANGE_OPTIONS_TOKEN,
                originalHandler,
            );
            exchangeOption =
                typeof exchangeOption === 'string'
                    ? { name: exchangeOption }
                    : exchangeOption;
            exchangeOption.type = exchangeOption.type || 'topic';
            exchangeOption.options = exchangeOption.options || {
                durable: false,
            };

            const routingKey: string = Reflect.getMetadata(
                RABBITMQ_SUBSCRIBE_EXCHANGE_ROUTINGKEY_TOKEN,
                originalHandler,
            );
            let queueOptions: IQueueOption = Reflect.getMetadata(
                RABBITMQ_SUBSCRIBE_QUEUE_OPTIONS_TOKEN,
                originalHandler,
            );
            queueOptions =
                typeof queueOptions === 'string'
                    ? { name: queueOptions }
                    : !queueOptions
                    ? {}
                    : queueOptions;
            const $channel = this._connection.createChannel({
                json: true,
                setup: async (channel: ConfirmChannel) => {
                    try {
                        const assertExchange = await channel.assertExchange(
                            exchangeOption.name,
                            exchangeOption.type,
                            exchangeOption.options,
                        );
                        let assertQueue: Replies.AssertQueue;
                        // eslint-disable-next-line prefer-const
                        assertQueue = await channel.assertQueue(
                            queueOptions.name ||
                                exchangeOption.name + routingKey,
                            queueOptions.options,
                        );
                        await channel.bindQueue(
                            assertQueue.queue,
                            assertExchange.exchange,
                            routingKey,
                        );
                        await channel.consume(assertQueue.queue, (message) => {
                            this._logger.log(
                                // eslint-disable-next-line max-len
                                `send message from exchange[${message.fields.exchange}] to comsumer[${originalHandler.name}] via routingKey[${message.fields.routingKey}]`,
                            );
                            const content = JSON.parse(
                                message.content.toString(),
                            );
                            originalHandler
                                .call(
                                    method.discoveredMethod.parentClass
                                        .instance,
                                    content,
                                    message.fields,
                                    message.properties,
                                )
                                .then(() => {
                                    channel.ack(message);
                                })
                                .catch((error) => {
                                    this._logger.error(error);
                                    channel.ack(message);
                                });
                        });
                    } catch (error) {
                        this._logger.error(error);
                    }
                },
            });
            await $channel.waitForConnect();
            this._logger.log(
                `Found ${method.discoveredMethod.parentClass.name}#${method.discoveredMethod.methodName} using @RabbitmqSubscribe()`,
            );
        }
    }

    async publish(
        optionOrName: IExchangeOption | string,
        routingKey: string,
        content: any,
        publishOptions?: Options.Publish,
    ) {
        let exchangeOption: IExchangeOption;
        // eslint-disable-next-line prefer-const
        exchangeOption =
            typeof optionOrName === 'string'
                ? { name: optionOrName }
                : optionOrName;
        exchangeOption.type = exchangeOption.type || 'topic';
        exchangeOption.options = exchangeOption.options || { durable: false };

        if (!this._publishChannels[exchangeOption.name]) {
            this._publishChannels[
                exchangeOption.name
            ] = this._connection.createChannel({
                json: true,
                // eslint-disable-next-line @typescript-eslint/require-await
                setup: async (channel: ConfirmChannel) => [
                    channel.assertExchange(
                        exchangeOption.name,
                        exchangeOption.type,
                        exchangeOption.options,
                    ),
                ],
            });
            await this._publishChannels[exchangeOption.name].waitForConnect();
        }
        this._logger.log(
            JSON.stringify({
                routingKey,
                content,
                publishOptions,
                exchangeOption: exchangeOption.name,
            }),
        );
        this._publishChannels[exchangeOption.name].publish(
            exchangeOption.name,
            routingKey,
            content,
            publishOptions,
        );
    }

    async close() {
        if (this._connection) {
            await this._connection.close();
        }
    }
}
