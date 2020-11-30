import { FactoryProvider } from '@nestjs/common';
import { connect } from 'amqp-connection-manager';

import { RabbitmqConnection } from './rabbitmq.connection';
import { RabbitmqContainer } from './rabbitmq.container';
import { IRabbitmqConnectionOption } from './rabbitmq.options';
import {
    getRabbitmqConnectionOptionsToken,
    getRabbitmqConnectionToken,
} from './utils';

export type ConnectionFactoryProvider = FactoryProvider<
    RabbitmqConnection | Promise<RabbitmqConnection>
>;
export function rabbitmqConnectionFactory(
    connectionOptions: IRabbitmqConnectionOption,
): ConnectionFactoryProvider {
    return {
        provide: getRabbitmqConnectionToken(connectionOptions.name),
        useFactory: async (
            rabbitmqConnection: RabbitmqConnection,
        ): Promise<RabbitmqConnection> =>
            new Promise((resolve, reject) => {
                let hasConnect = false;
                const mqConnection = connect(
                    connectionOptions.urls,
                    connectionOptions.options,
                );
                mqConnection.on('connect', () => {
                    hasConnect = true;
                });
                rabbitmqConnection.setConnection(mqConnection);
                RabbitmqContainer.set(
                    connectionOptions.name,
                    rabbitmqConnection,
                );
                const mqIntercal = setInterval(() => {
                    if (hasConnect) {
                        resolve(rabbitmqConnection);
                        clearInterval(mqIntercal);
                    }
                }, 500);
                setTimeout(() => {
                    if (!hasConnect) {
                        reject(
                            'Rabbitmq not connect in 5 seconds. Please Check your connection options',
                        );
                    }
                }, 5000);
            }),
        inject: [RabbitmqConnection],
    };
}

export function rabbitmqConnectionAsyncFactory(
    name: string,
): ConnectionFactoryProvider {
    return {
        provide: getRabbitmqConnectionToken(name),
        useFactory: async (
            rabbitmqConnection: RabbitmqConnection,
            connectionOptions: IRabbitmqConnectionOption,
        ): Promise<RabbitmqConnection> =>
            new Promise((resolve, reject) => {
                let hasConnect = false;
                const mqConnection = connect(
                    connectionOptions.urls,
                    connectionOptions.options,
                );
                mqConnection.on('connect', () => {
                    hasConnect = true;
                });
                rabbitmqConnection.setConnection(mqConnection);
                RabbitmqContainer.set(
                    connectionOptions.name,
                    rabbitmqConnection,
                );
                const mqIntercal = setInterval(() => {
                    if (hasConnect) {
                        resolve(rabbitmqConnection);
                        clearInterval(mqIntercal);
                    }
                }, 500);
                setTimeout(() => {
                    if (!hasConnect) {
                        clearInterval(mqIntercal);
                        reject(
                            'Rabbitmq not connect in 5 seconds. Please Check your connection options',
                        );
                    }
                }, 5000);
            }),
        inject: [RabbitmqConnection, getRabbitmqConnectionOptionsToken(name)],
    };
}
