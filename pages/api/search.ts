// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Item } from '../../types/common';
import { protos, SearchServiceClient } from '@google-cloud/retail'

type ResponseBody = {
  items: Item[]
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const placement = "projects/gcp-study-327707/locations/global/catalogs/default_catalog/placements/default_search"
  const query = req.query;
  const { searchWord } = query;

  const client = new SearchServiceClient();
  const searchRequest: protos.google.cloud.retail.v2alpha.ISearchRequest = {
    placement: placement,
    visitorId: 'testVisitorId',
    query: searchWord as string,
    pageSize: 500,
    offset: 0,
    pageToken: ''
  }

  const searchResult = await client.search(searchRequest, {
    autoPaginate: false,
  })
  
  res.status(200).json(searchResult)
}
