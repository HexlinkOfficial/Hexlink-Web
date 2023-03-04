## Project Setup

```sh
npm install
```

### Compile and build typescript to js
```sh
export GOOGLE_APPLICATION_CREDENTIALS='\path\key.json'
npm run build
```

### Start function emulators for local testing
```sh
npm run serve
```

### Deploy to firebase with production env
```sh
npm run deploy
```

## Troubleshooting
1. Remember to build the project before serving/deploying to include your code changes
2. If you are adding new functions, you will need deploy it first otherwise emulators won't pick up the change
3. Ensure doppler is properly set up and it's reading secrets correctly. You can manually run `doppler secrets download --no-file | jq '{doppler: .}'` at your terminal to check
4. If Failed to start serve `npm run serve`, error `dyld[78072]: missing symbol called` occurred, please follow the steps to fix:
   - Start a new shell using Rosetta2: 
     - `$ arch -x86_64 zsh`
   - In that shell, reinstall the x64 version of Node.js
     - `$ nvm use system`
     - `$ nvm cache clear`
     - `$ nvm uninstall 19 # or the version you installed`
     - `$ nvm install 19   # or the version you need`
     - `$ nvm use 19       # the version you installed`
   - Re-install and build npm dependencies from scratch
     - `$ rm -rf node_modules`
     - `$ yarn cache clean # install yarn by *npm install --global yarn* if you haven't`
     - `$ yarn install`

