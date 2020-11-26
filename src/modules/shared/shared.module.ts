import { Global, Module } from '@nestjs/common';
import { ConfigService } from 'common/config';

const providers = [ConfigService];

@Global()
@Module({
    providers,
    exports: [...providers],
})
export class SharedModule {}
