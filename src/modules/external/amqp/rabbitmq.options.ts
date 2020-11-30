import { FactoryProvider } from '@nestjs/common';
import { ModuleMetadata } from '@nestjs/common/interfaces';
import { AmqpConnectionManagerOptions } from 'amqp-connection-manager';
import { Options } from 'amqplib';

export interface IRabbitmqConnectionOption {
    name?: string;
    urls: string[];
    options?: AmqpConnectionManagerOptions;
}

export interface IRabbitmqAsyncConnectionOption
    extends Pick<ModuleMetadata, 'imports'> {
    name?: string;
    inject?: FactoryProvider['inject'];
    useFactory: (
        ...args: any[]
    ) => IRabbitmqConnectionOption | Promise<IRabbitmqConnectionOption>;
}

export interface IExchangeOption {
    name: string;
    type?: string;
    options?: Options.AssertExchange;
}

export interface IQueueOption {
    name?: string;
    options?: Options.AssertQueue;
}
