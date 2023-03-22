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


### git workflow:
1. fork repo
2. ```git clone <forked repo>```
3. ```git remote add upstream <Hexlink repo>```


#### pre code change:
in local main branch
1. ```git fetch --all```
2. ```git merge upstream/main```
   or 
   ```git pull upstream/main```
3. ```git checkout -b <new_work_branch>```

#### after code change
in local <new_work_branch>
1. ```git add <all changed files>```
2. ```git commit -m "<PR title and commit msg>"```
3. ```git push origin <new_work_branch>```

#### on github, HEXlink repo page
1. create pull request
2. add reviewer

#### after approval
1. merge PR

#### Other
1. delete local branch: ```git branch -D <branch_name>```
2. stash current change: ```git stash```
3. unstash current change: ```git stash pop```
4. cherry-pick commit from other local branches: ```git cherry-pick <commit_number>```
5. squash commits into one: ```git rebase i HEAD~<number of last x commits>```
