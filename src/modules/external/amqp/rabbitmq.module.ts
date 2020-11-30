import { DiscoveryModule } from '@golevelup/nestjs-discovery';
import {
    DynamicModule,
    Global,
    Module,
    OnModuleDestroy,
    OnModuleInit,
} from '@nestjs/common';

import { RabbitmqConnection } from './rabbitmq.connection';
import { RabbitmqContainer } from './rabbitmq.container';
import {
    IRabbitmqAsyncConnectionOption,
    IRabbitmqConnectionOption,
} from './rabbitmq.options';
import {
    rabbitmqConnectionAsyncFactory,
    rabbitmqConnectionFactory,
} from './rabbitmq.provider';
import { RabbitmqService } from './rabbitmq.service';
import {
    getRabbitmqConnectionOptionsToken,
    getRabbitmqConnectionToken,
} from './utils';

@Global()
@Module({
    imports: [DiscoveryModule],
    providers: [RabbitmqService],
    exports: [RabbitmqService],
})
export class RabbitmqModule implements OnModuleInit, OnModuleDestroy {
    onModuleInit() {
        return;
    }

    async onModuleDestroy() {
        await RabbitmqContainer.clearAndShutdown();
    }

    static register(options: IRabbitmqConnectionOption): DynamicModule {
        return {
            module: RabbitmqModule,
            providers: [
                RabbitmqConnection,
                {
                    provide: getRabbitmqConnectionOptionsToken(options.name),
                    useValue: options,
                },
                rabbitmqConnectionFactory(options),
            ],
            exports: [
                getRabbitmqConnectionToken(options.name),
                RabbitmqConnection,
            ],
        };
    }

    static registerAsync(
        options: IRabbitmqAsyncConnectionOption,
    ): DynamicModule {
        return {
            module: RabbitmqModule,
            imports: options.imports || [],
            providers: [
                RabbitmqConnection,
                {
                    provide: getRabbitmqConnectionOptionsToken(options.name),
                    inject: options.inject,
                    useFactory: options.useFactory,
                },
                rabbitmqConnectionAsyncFactory(options.name),
            ],
            exports: [
                getRabbitmqConnectionToken(options.name),
                RabbitmqConnection,
            ],
        };
    }
}
