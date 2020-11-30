import {
    RABBITMQ_SUBSCRIBE_EXCHANGE_OPTIONS_TOKEN,
    RABBITMQ_SUBSCRIBE_EXCHANGE_ROUTINGKEY_TOKEN,
    RABBITMQ_SUBSCRIBE_QUEUE_OPTIONS_TOKEN,
} from './rabbitmq.constants';
import { IExchangeOption, IQueueOption } from './rabbitmq.options';

export function RabbitmqSubscribe(
    exchangeOption: string,
    routingKey: string,
    queueOption?: IQueueOption,
): MethodDecorator;
export function RabbitmqSubscribe(
    exchangeOption: IExchangeOption,
    routingKey: string,
    queueOption?: IQueueOption,
): MethodDecorator;
export function RabbitmqSubscribe(
    exchangeOption: string,
    routingKey: string,
    queueOption?: string,
): MethodDecorator;
export function RabbitmqSubscribe(
    exchangeOption: IExchangeOption,
    routingKey: string,
    queueOption?: string,
): MethodDecorator;
export function RabbitmqSubscribe(
    exchangeOption: IExchangeOption | string,
    routingKey: string,
    queueOption?: IQueueOption | string,
): MethodDecorator {
    return (target, propertyKey, descriptor: PropertyDescriptor) => {
        Reflect.defineMetadata(
            RABBITMQ_SUBSCRIBE_EXCHANGE_OPTIONS_TOKEN,
            exchangeOption,
            descriptor.value,
        );
        Reflect.defineMetadata(
            RABBITMQ_SUBSCRIBE_EXCHANGE_ROUTINGKEY_TOKEN,
            routingKey,
            descriptor.value,
        );
        Reflect.defineMetadata(
            RABBITMQ_SUBSCRIBE_QUEUE_OPTIONS_TOKEN,
            queueOption,
            descriptor.value,
        );
        return descriptor;
    };
}
