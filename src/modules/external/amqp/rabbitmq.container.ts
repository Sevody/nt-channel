import { RabbitmqConnection } from './rabbitmq.connection';

export class RabbitmqContainer {
    private static _storage = new Map<string, RabbitmqConnection>();

    static set(name: string, connection: RabbitmqConnection) {
        RabbitmqContainer._storage.set(name, connection);
    }

    static get(name: string) {
        RabbitmqContainer._storage.get(name);
    }

    static async clearAndShutdown() {
        const shutdownTasks = [];
        RabbitmqContainer._storage.forEach((connection) => {
            shutdownTasks.push(
                new Promise((resolve) => {
                    void connection.close().then(resolve);
                }),
            );
        });
        await Promise.all(shutdownTasks);
        RabbitmqContainer._storage.clear();
    }
}
