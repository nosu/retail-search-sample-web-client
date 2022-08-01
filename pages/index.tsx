import type { NextPage } from 'next'
import Head from 'next/head'
import { useState } from 'react'
import axios from 'axios'
import ItemList from './itemList'
import { AppBar, Container, InputAdornment, TextField, Toolbar, Typography } from '@mui/material'
import { Search } from '@mui/icons-material'
import { Item, SearchResult } from '../types/common'

const Home: NextPage = () => {
  const [searchWord, setSearchWord] = useState("")
  const [items, setItems] = useState<Item[]>([])
  const [searchResult, setSearchResult] = useState<SearchResult>({})
  const [hasMore, setHasMore] = useState(false)

  const fetchFirstItems = (e: any) => {
    if (e.key == 'Enter') {
      e.preventDefault()
      console.log('keyword is ' + searchWord)
      axios.get(`/api/search?searchWord=${searchWord}`)
        .then(response => {
          console.log(response.data)
          const items = response.data[0]
          const searchParams = response.data[1]
          const nextPageToken = response.data[2].nextPageToken
          const totalSize = response.data[2].totalSize

          setItems(items)
          setSearchResult({ ...searchParams, nextPageToken: nextPageToken, totalSize: totalSize })
          if (nextPageToken && items.length != totalSize) {
            setHasMore(true)
          }
        })
    }
  }

  const fetchNextItems = async () => {
    console.log('fetchNextItems')
    console.log(`nextPageToken: ${searchResult.nextPageToken}`)
    console.log(`query: ${searchResult.query}`)
    console.log(`hasMore: ${hasMore}`)
    if (!searchResult.query || !hasMore) {
      return
    }

    const response = await axios.get(`/api/search?searchWord=${searchResult.query}&pageToken=${searchResult.nextPageToken}`)
    console.log(response.data)
    const newItems = response.data[0]
    const searchParams = response.data[1]
    const nextPageToken = response.data[2].nextPageToken
    const fetchedItemCount = items.length + newItems.length

    setItems(oldItems => [...oldItems, ...newItems])
    setSearchResult({ ...searchParams, nextPageToken: nextPageToken, totalSize: searchResult.totalSize })
    console.log(`items.length: ${items.length}`)
    console.log(`totalSize: ${searchResult.totalSize}`)
    if (!nextPageToken || fetchedItemCount == searchResult.totalSize) {
      setHasMore(false)
    }
  }

  return (
    <div>
      <Head>
        <title>Retail Search Demo</title>
      </Head>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Retail Search Demo
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" sx={{ pt: 5 }}>
        <TextField
          sx={{ mb: 5 }}
          type="text"
          fullWidth={true}
          value={searchWord}
          placeholder="Enter Search Keyword"
          onChange={e => setSearchWord(e.target.value)}
          onKeyPress={e => fetchFirstItems(e)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
        {(searchResult.totalSize != null) && <Typography variant='body2' sx={{ mb: 2 }}>{searchResult.totalSize} items found</Typography>}
        <ItemList items={items} fetchNextItems={fetchNextItems} hasMore={hasMore} />
      </Container>
    </div>
  )
}

export default Home
