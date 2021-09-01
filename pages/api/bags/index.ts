import { NextApiRequest, NextApiResponse } from 'next'
import pMap from 'p-map'
import { chunk, flatten, orderBy } from 'lodash'
import { utils as etherUtils, BigNumber } from 'ethers'
import parseDataUrl from 'parse-data-url'
import { rarityImage } from 'loot-rarity'
import type { OpenseaResponse, Asset } from '../../../utils/openseaTypes'
import Bags from '../../../data/bags.json'
import LootIds from '../../../data/loot-ids.json'

//const apiKey = process.env.OPENSEA_API_KEY

const fetchBagPage = async (ids: string[]) => {
  let url = 'https://api.opensea.io/api/v1/assets?collection=lootproject&'
  url += ids.map((id) => `token_ids=${id}`).join('&')

  const res = await fetch(url, {
    // headers: {
    //   'X-API-KEY': apiKey,
    // },
  })
  const json: OpenseaResponse = await res.json()

  return Promise.all(
    json.assets.map(async (asset) => {
      // Parse the JSON from the data URI
      const { image } = JSON.parse(
        parseDataUrl(asset.token_metadata).toBuffer().toString(),
      )
      // Parse the SVG from the data URI
      const svg = parseDataUrl(image).toBuffer().toString()
      return {
        ...asset,
        image_url: await rarityImage(svg, {
          colorFn: ({ itemName }) =>
            itemName.toLowerCase().includes('divine robe') && 'cyan',
        }),
      }
    }),
  )
}

export interface BagInfo {
  id: string
  price: Number
  url: string
  svg: string
}

export const fetchBags = async (lootItem) => {
  const chunked = chunk(LootIds[lootItem], 20)
  const data = await pMap(chunked, fetchBagPage, { concurrency: 2 })
  const mapped = flatten(data)
    .filter((d) => d?.sell_orders?.[0]?.payment_token_contract.symbol === 'ETH')
    .map((a: Asset): BagInfo => {
      return {
        id: a.token_id,
        price: Number(
          etherUtils.formatUnits(
            BigNumber.from(a.sell_orders[0]?.current_price.split('.')[0]),
          ),
        ),
        url: a.permalink + '?ref=0xfb843f8c4992efdb6b42349c35f025ca55742d33',
        svg: a.image_url,
      }
    })

  return {
    bags: orderBy(mapped, ['price', 'id'], ['asc', 'asc']),
    lastUpdate: new Date().toISOString(),
  }
}

const handler = async (_req: NextApiRequest, res: NextApiResponse) => {
  try {
    const data = await fetchBags()
    res.status(200).json(data)
  } catch (err) {
    res.status(500).json({ statusCode: 500, message: err.message })
  }
}

export default handler
