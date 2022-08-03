// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { protos, SearchServiceClient } from '@google-cloud/retail'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const query = req.query;
  const { searchWord, pageToken, projectId, catalogName, searchServiceName } = query;

  const mergedProjectId = projectId ? projectId : process.env.PROJECT_ID
  const mergedCatalogName = catalogName ? catalogName : process.env.CATALOG_NAME
  const mergedSearchServiceName = searchServiceName ? searchServiceName : process.env.SEARCH_SERVICE_NAME
  const placement = `projects/${mergedProjectId}/locations/global/catalogs/${mergedCatalogName}/placements/${mergedSearchServiceName}`

  const client = new SearchServiceClient();
  const searchRequest: protos.google.cloud.retail.v2alpha.ISearchRequest = {
    placement: placement,
    visitorId: 'testVisitorId',
    query: searchWord as string,
    pageSize: 50,
    pageToken: pageToken ? (pageToken as string) : ''
  }

  console.log('searchRequest', searchRequest)

  const searchResult = await client.search(searchRequest, {
    autoPaginate: false,
  })
  
  res.status(200).json(searchResult)
}
