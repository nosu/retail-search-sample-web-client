import { Box, Card, CardActionArea, CardContent, CardMedia, CircularProgress, Typography } from '@mui/material'
import type { NextPage } from 'next'
import InfiniteScroll from 'react-infinite-scroll-component'
import { Item } from '../types/common'

type ItemListProps = {
  items: Item[]
  fetchNextItems: () => any
  hasMore: boolean
}

const ItemList: NextPage<ItemListProps> = ({ items, fetchNextItems, hasMore }) => {
  const isItemEmpty = (items && Array.isArray(items) && items.length > 0)
  const loader = <Box sx={{ display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>

  return (
    isItemEmpty
      ? (
        <InfiniteScroll
          dataLength={items.length}
          next={fetchNextItems}
          hasMore={hasMore}
          loader={loader}
          style={{ overflow: 'hidden' }}
        >
          {items.map((item) => (
            <Card sx={{ minWidth: 275, ml: '1px', mr: '1px', mb: 2, display: 'flex' }} key={item.id}>
              <CardActionArea sx={{ display: 'flex', justifyContent: 'flex-start' }} href={item.product.uri} target='_blank'>
                {item.product.images && (item.product.images.length > 0) && (<CardMedia
                  component="img"
                  sx={{ width: 151, mr: 2, ml: 2 }}
                  image={item.product.images[0].uri}
                  alt={item.product.title}
                />)}
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <CardContent>
                    <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                      {item.product.categories[0]}
                    </Typography>
                    <Typography variant="h6" component="div">
                      {item.product.title}
                    </Typography>
                    <Typography variant="body2">
                      {
                        (item.product.description.length <= 100)
                          ? item.product.description
                          : item.product.description.substring(0, 100) + '...'
                      }
                    </Typography>
                  </CardContent>
                </Box>
              </CardActionArea>
            </Card>
          ))}
        </InfiniteScroll>)
      : (<div></div>)
  )
}

export default ItemList
