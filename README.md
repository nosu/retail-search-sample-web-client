# Retail Search - Sample web client

A sample web client for [Retail Search](https://cloud.google.com/solutions/retail-product-discovery).

## How to Use

### Import your catalog data

- Import your catalog data following the [official docs](https://cloud.google.com/retail/docs/upload-catalog)
- The following columns are expected to be included in the catalog
  - name
  - title
  - description
  - uri
  - images[0].uri
  - attributes.vendor.text
  - retrievableFields (e.g. `"name,title,categories,description,uri,images,attributes.vendor.text"`)

### Deploy this client app to Cloud Run

- Create an Artifact Registry repo first (`${region}.pkg.dev/${projectId}/${repositoryName}`)
- Build & deploy!

```
## Build a container image
git clone https://github.com/nosu/retail-search-sample-web-client.git
cd retail-search-web-client
gcloud builds submit \
--tag ${region}.pkg.dev/${projectId}/${repositoryName}/retail-search \
--project ${projectId}

## Deploy the image as Cloud Run instance (Set `PROJECT_ID` environment variable)
gcloud run deploy retail-search-client \
--image ${region}.pkg.dev/${projectId}/${repositoryName}/retail-search \
--project ${projectId} \
--set-env-vars "PROJECT_ID=${projectId}" \
--allow-unauthenticated \
--service-account ${serviceAccount}
```
