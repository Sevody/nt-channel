import {
    RABBITMQ_CONNECTION_OPTIONS_TOKEN,
    RABBITMQ_CONNECTION_TOKEN,
} from './rabbitmq.constants';

export function getRabbitmqConnectionToken(
    token: string | symbol = RABBITMQ_CONNECTION_TOKEN,
) {
    if (token === RABBITMQ_CONNECTION_TOKEN) {
        return RABBITMQ_CONNECTION_TOKEN;
    }
    if (typeof token !== 'symbol') {
        return Symbol(token);
    }
    return token;
}

export function getRabbitmqConnectionOptionsToken(
    token: string | symbol = RABBITMQ_CONNECTION_OPTIONS_TOKEN,
) {
    if (token === RABBITMQ_CONNECTION_OPTIONS_TOKEN) {
        return RABBITMQ_CONNECTION_OPTIONS_TOKEN;
    }
    if (typeof token !== 'symbol') {
        return Symbol(token);
    }
    return token;
}
