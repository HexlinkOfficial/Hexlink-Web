## Project Setup

```sh
npm install
```

### Compile and build typescript to js
```sh
npm run build
```

### local testing
```sh
redis-server
doppler run -- npm run start
```

### deploy the app
The service has been deployed to the Google Compute Engine. The steps to deploy the service are as followings:

1. navigate to Compute Engine in google cloud console.

2. click VM instances in the left bar and ssh to the "transaction" instance. 

3. the service is running with pm2. To check the current status of the services:
```sh
pm2 status
pm2 logs
```

4. to delete the unused process:
```sh
pm2 delete <id>
```

5. to start the transaction service:
```sh
pm2 start doppler -- run -- npm -- start
```