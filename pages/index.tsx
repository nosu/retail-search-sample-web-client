import type { NextPage } from 'next'
import Head from 'next/head'
import { useContext, useState } from 'react'
import axios from 'axios'
import ItemList from './itemList'
import { Alert, AppBar, Button, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, InputAdornment, TextField, Toolbar, Typography } from '@mui/material'
import { AccountCircle, ConstructionOutlined, Search, Settings } from '@mui/icons-material'
import { Config, Item, SearchResult } from '../types/common'
import { ConfigContext } from './_app'
import ConfigDialog from './configDialog'

const Home: NextPage = () => {
  const [searchWord, setSearchWord] = useState("")
  const [items, setItems] = useState<Item[]>([])
  const [searchResult, setSearchResult] = useState<SearchResult>({})
  const [hasMore, setHasMore] = useState(false)
  const [isConfigDialogOpen, setIsConfigDialogOpen] = useState(false)
  const { config, setConfig } = useContext(ConfigContext)
  const [error, setError] = useState("")

  const createSearchQueryString = (config: Config) => {
    const queryString = (config.projectId ? `&projectId=${config.projectId}` : '') +
      (config.catalogName ? `&catalogName=${config.catalogName}` : '') +
      (config.searchServiceName ? `&projectId=${config.searchServiceName}` : '')
    return queryString
  }

  const fetchFirstItems = async (e: any) => {
    if (e.key == 'Enter') {
      e.preventDefault()
      console.log('keyword is ' + searchWord)
      try {
        const response = await axios.get(`/api/search?searchWord=${searchWord}${createSearchQueryString(config)}`)
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
      } catch (err) {
        setError("Search failed. Check configuration and try again.")
      }
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

    try {
      const response = await axios.get(`/api/search?searchWord=${searchResult.query}&pageToken=${searchResult.nextPageToken}${createSearchQueryString(config)}`)
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
    } catch (err) {
      setError("Failed to fetch next items.")
    }
  }

  const openConfigDialog = () => {
    setIsConfigDialogOpen(true)
  }

  const closeConfigDialog = () => {
    setIsConfigDialogOpen(false)
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
          <div>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={openConfigDialog}
              color="inherit"
            >
              <Settings />
            </IconButton>
          </div>
        </Toolbar>
        <ConfigDialog isConfigDialogOpen={isConfigDialogOpen} closeConfigDialog={closeConfigDialog} />
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
        {error && <Alert severity="error">{error}</Alert>}
        {(searchResult.totalSize != null) && <Typography variant='body2' sx={{ mb: 2 }}>{searchResult.totalSize} items found</Typography>}
        <ItemList items={items} fetchNextItems={fetchNextItems} hasMore={hasMore} />
      </Container>
    </div>
  )
}

export default Home
