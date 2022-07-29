import { Box, Card, CardActionArea, CardContent, CardMedia, Typography } from '@mui/material'
import type { NextPage } from 'next'
import { Item } from '../types/common'

type ItemListProps = {
  items: Item[]
}

const ItemList: NextPage<ItemListProps> = ({ items }) => {
  return (
    <div>
      {items && Array.isArray(items) && items.map((item) => (
        <Card sx={{ minWidth: 275, mb: 2, display: 'flex' }} key={item.id}>
          <CardActionArea sx={{ display: 'flex', justifyContent: 'flex-start' }} href={item.product.uri} target='_blank'>
            <CardMedia
              component="img"
              sx={{ width: 151, mr: 2, ml: 2 }}
              image={item.product.images[0].uri}
              alt={item.product.title}
            />
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
    </div>
  )
}

export default ItemList
