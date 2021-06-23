import React, { useState, useEffect } from 'react';
import { Box, Button, Card, Heading, Grommet, Grid, Image, Table, Text, Layer, ResponsiveContext, TableBody, TableRow, TableCell, Stack, CardHeader, CardBody, CardFooter } from 'grommet';
import { FormClose, Notification } from 'grommet-icons';
import picHammer from './hammer.jpg';
import picNagel from './nagel.png';
import Barcode from 'react-barcode';
import {BrowserRouter as Router, Route, useLocation, useRouteMatch} from 'react-router-dom';
import queryString from 'query-string';

import fonts from './font.css';

const theme = {
  global: {
    colors: {
      brand: '#01a982',
    },
    font: {
      family: 'HPEBrandFont',
      size: '18px',
      height: '20px'
    }
  }
}

class Item {
  constructor(name, price, offerPrice, image, inStock, description=null) {
    this.name = name;
    this.price = price;
    this.image = image;
    this.offerPrice = offerPrice;
    this.inStock = inStock;
    this.description = description;
  }
}

const AppBar = (props) => {
  return <Box
    tag='header'
    direction='row'
    align='center'
    justify='between'
    background='brand'
    pad={{ left: 'medium', right: 'small', vertical: 'small' }}
    elevation='medium'
    style={{ zIndex: '1' }}
    {...props}
  />
};

const OfferCard = (props) => {
  const [mouseOver, setMouseOver] = useState(false)

  const image = props.offerItem.image?props.offerItem.image:picNagel;

  return (
    <Card 
      gridArea={props.gridArea} 
      background={mouseOver?'light-1':'light-3'}
      border={mouseOver?'5px':'0'}
      onMouseEnter={() => setMouseOver(true)}
      onMouseLeave={() => setMouseOver(false)}

      onMouseDown={() => {
        props.setShowSpotlight(props.offerItem);
      }}
    >
      <CardHeader justify='center'>
        <Text size='20px' alignSelf='center' style={{padding: '5px'}}>{props.offerItem.name}</Text>
      </CardHeader>
      <CardBody pad='small'>
          <Image fit='contain' src={image}/>
      </CardBody>
      <CardFooter justify='center'>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell scope="row">
                Sie sparen:
              </TableCell>
              <TableCell>
                <span style={{color: '#FF0000'}}>{(1 - props.offerItem.offerPrice/props.offerItem.price).toFixed(2) * 100}%</span>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardFooter>
    </Card>
  )
}

const SidebarContent = (props) => {
  return(
    <Box>
      <Box>
        <Heading>Ihre Coupons:</Heading>
      </Box>
      <Box justify='center'>
        {props.barcodes.map((barcode) => <Barcode value={barcode}/>)}
      </Box>
    </Box>
  );
}

const OfferTable = (props) => {
 
 return(<TableBody>
    <TableRow>
      <TableCell scope="row">
        Früher:
      </TableCell>
      <TableCell>
        <span><s>{props.item.price.toFixed(2)}€</s></span>
      </TableCell>
    </TableRow>
    <TableRow>
      <TableCell scope="row">
        Unser Preis:
      </TableCell>
      <TableCell>
        <span style={{color: '#FF0000'}}>{props.item.offerPrice.toFixed(2)}€</span>
      </TableCell>
    </TableRow><TableRow>
      <TableCell scope="row">
      </TableCell>
      <TableCell>
        {(1 - props.item.offerPrice/props.item.price).toFixed(2) * 100}% gespart!
      </TableCell>
    </TableRow>
  </TableBody>)
}

const NoOfferTable = (props) => {
  return (
    <TableBody>
      <TableRow>
        <TableCell scope="row">
          Preis:
        </TableCell>
        <TableCell>
          <span>{props.item.price.toFixed(2)}€</span>
        </TableCell>
      </TableRow>
    </TableBody>
  )
}


function App() {
  const [showSidebar, setShowSidebar] = useState(false);

  const [barcodes, setBarcodes] = useState(['Nagel 20%']);

  const [mainItem, setMainItem] = useState(new Item('Hammer Hammer', 50, 40, picHammer, true, ['Robuster Kopf aus geschmiedeter Stahllegierung', 'Leichter Holzstiel mit vibrationsdämpfendem Design, FSC-zertifiziert']));
  const [spotlightItems, setSpotlightItems] = useState([
    new Item('Nagel', 1, 0.7, picNagel, true, '10/10 Nagel'), 
    new Item('Nagel', 1, 0.7, picNagel, true, '10/10 Nagel'), 
    new Item('Nagel', 1, 0.7, picNagel, true, '10/10 Nagel')
  ]);

  const addCoupon = (item) => {
    let newBarcodes = barcodes;
    let stringToAdd = `${item.name} ${(1-item.offerPrice/item.price).toFixed(2) * 100}%`
    if (!newBarcodes.includes(stringToAdd)) {
      newBarcodes.push(stringToAdd);
    }
    setBarcodes([...newBarcodes]);
  }
  
  const { search } = useLocation();
  const values = queryString.parse(search)

  useEffect(() => {
    fetch({
      url: `https://ezmeral52gateway1.demo.local:10065/availability?productId=${values.id}`,
      method: 'GET',
      headers: {
        
      }
    })
      // .then((res) => res.json())
      .then((res) => console.log(res))
      .catch((err) => {
        console.log(err);
      });
  }, [values.id]);

  return (
      <Grommet theme={theme} themeMode='dark'>
        <ResponsiveContext.Consumer>
          {size => (
            <Box fill>
              <AppBar>
                <Heading level='3' margin='none'>MyBaumarkt</Heading>
                <Stack anchor='top-right'>
                  <Button 
                    icon={<Notification />} 
                    onClick={() => { setShowSidebar(!showSidebar) }} 
                  />
                  {barcodes.length !== 0 && <Box background='#FFFFFF' pad={{ horizontal: 'xsmall' }} round>{barcodes.length}</Box>}
                </Stack>
              </AppBar>
              <Box direction='row' flex overflow={{ horizontal: 'hidden' }}>
                <Box flex align='center' justify='center' margin={{top:'40px'}}>
                  <Grid
                    rows={['xsmall', 'medium', 'xxsmall', 'medium']}
                    columns={[size==='small'?'small':'medium', 'medium']}
                    gap='small'
                    justify='stretch'
                    fill='vertical'
                    areas={[
                      { name: 'title', start: [0, 0], end: [1, 0] },
                      { name: 'picture', start: [0, 1], end: [0, 1] },
                      { name: 'info', start: [1, 1], end: [1, 1] },
                      { name: 'recoms', start: [0, 3], end: [1, 3] },
                    ]}
                  >
                    <Box flex gridArea='title' background='light-2'>
                      <Heading level='1' alignSelf='center' margin='auto'>{mainItem.name}</Heading>
                    </Box>
                    <Box flex gridArea='picture'>
                      <Image fit='contain' src={mainItem.image}/>
                    </Box>
                    <Box flex gridArea='info' pad='large' background='light-2'>
                      <Table>
                        {mainItem.offerPrice !== undefined?
                          <OfferTable item={mainItem}/>:
                          <NoOfferTable item={mainItem}/>
                        }
                      </Table>
                      <ul>
                        {mainItem.description.map((desc) => <li><Text size='18px'>{desc}</Text></li>)}
                      </ul>
                      <Box flex style={{justifyContent:'flex-end'}}>
                          {mainItem.inStock? 
                          <Button primary alignSelf='end' fill='horizontal' label="Online"/>:(
                          <Box>
                            <Text alignSelf='center' style={{padding: '10px'}}>Nicht mehr vorrätig? Bestellen Sie online!</Text>
                            <Button primary alignSelf='center' fill='horizontal' color='#660000' label="Online"/>
                          </Box>
                          )}
                      </Box>
                    </Box>
                    <Box flex gridArea='recoms' background='brand'>
                      <Grid
                        rows={['xsmall','small']}
                        columns={size==='small'?['30%', '30%', '30%']:['small', 'small', 'small']}
                        gap='small'
                        margin={{top:'10px'}}
                        justifyContent='center'
                        areas={[
                          { name: 'saveHereText', start: [0, 0], end: [2, 0]},
                          { name: '1item', start: [0, 1], end: [0, 1] },
                          { name: '2item', start: [1, 1], end: [1, 1] },
                          { name: '3item', start: [2, 1], end: [2, 1] },
                        ]}
                      >
                        <Heading level='2' gridArea='saveHereText' margin='auto' style={{padding: '10px'}}>Beim Kauf von '{mainItem.name}' erhalten Sie Rabatte auf:</Heading>
                        {spotlightItems.map((item, index) => {
                          return (
                            <OfferCard 
                              offerItem={item}
                              gridArea={(index+1)+'item'} 
                              setShowSpotlight={addCoupon}
                              index={index}
                            />
                          )}
                        )}
                      </Grid>
                      <Text alignSelf='center' margin='20px'>Klicken Sie auf die Gegenstände, um Ihre Coupons zu erhalten</Text>
                    </Box>
                  </Grid>
                </Box>
                {(showSidebar &&
                  <Layer full={false} margin='large' responsive={false} onClickOutside={()=>setShowSidebar(false)}>
                    <Box
                      background='light-2'
                      width='large'
                      height='large'
                    >
                      <Box
                        background='light-2'
                        tag='header'
                        justify='end'
                        align='center'
                        direction='row'
                      >
                        <Button
                          icon={<FormClose />}
                          onClick={() => setShowSidebar(false)}
                        />
                      </Box>
                      <Box
                        fill
                        background='light-2'
                        align='center'
                      >
                        <SidebarContent barcodes={barcodes}/>
                      </Box>
                      <Box justify='end'>
                        <Button primary alignSelf='center' margin='small' label='reset' style={{width: '25%'}} onClick={() => setBarcodes([])}/>
                      </Box>
                    </Box>
                  </Layer>
                )}
              </Box>
            </Box>
          )}
        </ResponsiveContext.Consumer>
      </Grommet>
  );
}

export default App;
