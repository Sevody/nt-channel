# nt-channel

> Message Channel And Chat Bot for _Line_ & _Message_ & _Telegram_

## Getting started

### Prerequisites

-   Node.js installed (version 14)

### Setup

-   Local setup

```bash
cd nt-channel
cp .env.sample .env # change values after copying
npm i
npm run start:dev
```

-   Chatbot setup for local usage

```bash
npx ngrok http 7010
# echo "Y" | npm run messenger-webhook:set <URL>/webhooks/messenger
```

### Build

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
npm run lint:fix
```

### Testing

```bash
npm test
npm run test:e2e
```

### API documentation

Generated at `/api-docs` endpoint

### Technologies used

-   Node.js, TypeScript, NestJS, Bottender
