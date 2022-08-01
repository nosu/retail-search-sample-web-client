// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { protos, SearchServiceClient } from '@google-cloud/retail'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const projectId = process.env.PROJECT_ID
  const catalogName = process.env.CATALOG_NAME
  const searchServiceName = process.env.SEARCH_SERVICE_NAME
  const placement = `projects/${projectId}/locations/global/catalogs/${catalogName}/placements/${searchServiceName}`
  const query = req.query;
  const { searchWord, pageToken } = query;

  const client = new SearchServiceClient();
  const searchRequest: protos.google.cloud.retail.v2alpha.ISearchRequest = {
    placement: placement,
    visitorId: 'testVisitorId',
    query: searchWord as string,
    pageSize: 50,
    // offset: 0,
    pageToken: pageToken ? (pageToken as string) : ''
  }

  console.log('searchRequest', searchRequest)

  const searchResult = await client.search(searchRequest, {
    autoPaginate: false,
  })
  
  res.status(200).json(searchResult)
}
