import { BagInfo, fetchBags } from './api/bags'
import { format as ts } from 'timeago.js'
import React, { useCallback, useEffect, useMemo, useState } from "react"
import Loot from '../data/loot.json'
import AutoComplete from './components/Autocomplete'


const Bag = ({ bag }: { bag: BagInfo }) => {
  return (
    <a href={bag.url} target="_blank">
      <div className="m-auto pb-4 mb-8 flex flex-col justify-center items-center gap-2 p-4 md:m-4 border border-white transform hover:scale-105 transition-all bg-black w-full md:w-96">
        <img src={bag.svg} alt="" width="350" height="350" />
        <div className="text-center">
          <p className="text-lg">#{bag.id}</p>
          <p>{bag.price} ETH</p>
        </div>
      </div>
    </a>
  )
}

const IndexPage = () => {

  const [bags, setBags] = useState<array | null>(null)
  const [selectedLoot, setSelectedLoot] = useState<string>('')
  const [lastUpdate, setLastUpdate] = useState<string>('')

  const selectLoot = useCallback(async (selection) => {
    console.log('updating loot bags')
    const data = await fetchBags(selection)
    setBags(data.bags)
    setLastUpdate(data.lastUpdate)
    setSelectedLoot(selection)
  }, [])

  return (
    <div className="py-3 md:pb-0 font-mono flex flex-col justify-center items-center gap-4 pt-10 md:w-screen">
      <h1 className="text-lg md:text-3xl">Floor Bags</h1>
      <div className="text-left w-100 max-w-screen-md">
        <label htmlFor="loot-autocomplete" className="md:text-m">Choose an item: </label>
        <AutoComplete
          suggestions={Loot}
          onSelect={selectLoot}
        />
      </div>
      <div className="text-center max-w-screen-md md:leading-loose">
        <p className="md:text-xl">
          There are {bags ? bags.length : ''} bags for sale with <i>{selectedLoot}</i>. The floor
          price is {(bags && bags.length) ? bags[0].price : '___'} ETH.
        </p>
        <p className="md:text-lg pt-2">
          Site by{' '}
          <a
            target="_blank"
            href="https://twitter.com/breterb"
            className="underline"
          >
            Bret Rouse
          </a>,
          based on the site{' '}
          <a
            target="_blank"
            href="https://robes.market/"
            className="underline"
          >
            robes.market
          </a>,
          by{' '}
          <a
            target="_blank"
            href="https://twitter.com/worm_emoji"
            className="underline"
          >
            worm_emoji
          </a>
          .
          <br />
          Join the{' '}
          <a
            target="_blank"
            className="underline"
            href="https://discord.gg/PyYUf2wghp"
          >
            Loot Discord
          </a>
          .
        </p>
        <p className="text-sm mv-4">Last updated {ts(lastUpdate)}</p>
      </div>
      <div className="grid md:grid-cols-2 pt-5">
        {bags ? bags.map((bag) => {
          return <Bag bag={bag} key={bag.id} />
        }) : ''}
      </div>
    </div>
  )
}

export default IndexPage
