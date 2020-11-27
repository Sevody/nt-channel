import { LineContext } from 'bottender';
import { LineClient } from 'messaging-api-line';
import tunnel from 'tunnel';
import { ConfigService } from 'common/config';
import { UserOptions } from 'modules/user/user.types';

export const getUserOptions = (context: LineContext): UserOptions => {
    const {
        platform,
        _session: {
            user: { id: userId },
        },
    } = context;
    return {
        [`${platform}_id`]: userId,
    };
};

export const setAgentProxy = (
    client: LineClient,
    config: ConfigService,
): void => {
    if (config.get('PROXY_ENABLE') === 'true') {
        client.axios.defaults.proxy = false;
        client.axios.defaults.httpsAgent = tunnel.httpsOverHttp({
            proxy: {
                host: config.get('PROXY_HOST'),
                port: config.get('PROXY_PORT'),
            },
        });
    }
};

export const isEnv = (environment: string): boolean =>
    process.env.NODE_ENV === environment;
