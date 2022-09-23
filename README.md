# Hexlink

Hexlink is the Web3 entrypoint for Web2 users. You can use any of your web2 identities to login Hexlink to receive and manage your tokens in a extremly easy way.

## Doppler Setup

We use doppler to manage our environment. Please check https://docs.doppler.com/docs/install-cli to install and setup doppler for your project

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
doppler run -- npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Deploy to firebase with production env

```sh
doppler run --config prd -- npm run deploy
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Run End-to-End Tests with [Cypress](https://www.cypress.io/)

```sh
npm run build
npm run test:e2e # or `npm run test:e2e:ci` for headless testing
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
