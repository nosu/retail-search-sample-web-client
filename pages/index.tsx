import axios from 'axios'
import type { NextPage } from 'next'
import { useState } from 'react'
import ItemList from './itemList'
import { AppBar, Container, InputAdornment, TextField, Toolbar, Typography } from '@mui/material'
import { Search } from '@mui/icons-material'
import { SearchResult } from '../types/common'
import Head from 'next/head'

const Home: NextPage = () => {
  const [searchWord, setSearchWord] = useState("")
  const [items, setItems] = useState([])
  const [searchResult, setSearchResult] = useState<SearchResult>({})

  const search = (e: any) => {
    if (e.key == 'Enter') {
      e.preventDefault()
      console.log('keyword is ' + searchWord)
      axios.get(`/api/search?searchWord=${searchWord}`)
        .then(response => {
          console.log(response.data)
          const items = response.data[0]
          const searchResult = response.data[2]
          setItems(items)
          setSearchResult(searchResult)
        })
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
          onKeyPress={e => search(e)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
        {(searchResult.totalSize != null) && <Typography variant='body2' sx={{ mb: 2 }}>{searchResult.totalSize} items found</Typography>}
        <ItemList items={items} />
      </Container>
    </div>
  )
}

export default Home
