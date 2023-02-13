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
doppler run -- npm run start
```

### deploy the app
1. set up gcloud and kubectl
2. connect kubectl to the cluster
```
gcloud container clusters get-credentials hexlink-transaction --zone us-central1-a
```
3. if have updated the deployment.yaml
```
kubectl apply -f deployment.yaml
```
4. if need to update docker and rebuild the image
```
### update docker
gcloud artifacts repositories update hexlink --location=us-central1

### build image
gcloud builds submit --tag us-central1-docker.pkg.dev/bridge23-27764/hexlink/hexlink-transaction .

### update the cluster to use the latest image
kubectl set image deployment/hexlink-transaction transaction-app=us-central1-docker.pkg.dev/bridge23-27764/hexlink/hexlink-transaction:<tag of latest image>
```
Note: The latest built image in Artifact Registry will be tagged as "latest" automatically. However, the deployment will only be triggered if it detects a change in the deployment config. It means that although the content of the latest image might have already been updated, kubectl cli will still treat it as the same image if using the same tag. The walk-around is to manually add a different tag to the latest image in google cloud console (Artifact Registry -> hexlink -> hexlink-transaction) and use that tag to update the cluster.
5. check the status of deployment/pods/nodes
```
 kubectl get deployments
kubectl get pods
kubectl get nodes
```
6. check the logs
```
kubectl logs <POD_NAME>
```
or you can view these resources from the Google Cloud console
7. check the history of the deployments
```
kubectl rollout history deployment/hexlink-transaction 
```
8. rollback
```
kubectl rollout undo deployment/hexlink-transaction                         # Rollback to the previous deployment
kubectl rollout undo deployment/hexlink-transaction --to-revision=2         # Rollback to a specific revision
```
