import React, { Component } from 'react';
import {
  FlatList,
  View
} from 'react-native';

// Function
import { getUrlImage, listenerData } from '../function/firebaseHelper';

// Component
import ItemCard from '../components/ItemCard';
import EmptyComp from '../components/EmptyComp'

export default class LinksScreen extends Component {
  constructor(props) {
    super(props)

    this.state = {
      items: [],
    }
  }

  componentDidMount() {
    listenerData('store-00005/transaction', (rawData) => this.setInformation(rawData))
  }

  setInformation = (rawData) => {
    let data = rawData.val();
    let arrData = [];

    let promiseData = Object.keys(data).map(function (key, index) {
      return new Promise((resolve, reject) => {
        if (data[key].confirm !== 'N') {
          getUrlImage('/itemList/' + data[key].pic)
            .then(url => {
              resolve(
                arrData.push({
                  'productName': data[key].product_name,
                  'orderNo': key,
                  'bookingTime': data[key].booking_timestamp,
                  'urlImage': url,
                  'transactionIdx': data[key].transaction_url,
                  'status': data[key].confirm
                })
              );
            })
        } else {
          resolve(
            // console.log('Not Push ' + key)
          )
        }
      })
    });

    Promise.all(promiseData)
      .then(() => {
        arrData = Promise.resolve(arrData.sort((a, b) => (a.bookingTime > b.bookingTime) ? 1 : ((b.bookingTime > a.bookingTime) ? -1 : 0)))

        arrData
          .then(data => {
            this.setState({
              items: data
            })
          })

      })

  }

  render() {
    return (
      <View>
        {this.state.items != null && this.state.items.length > 0 ?
          <FlatList
            data={this.state.items}
            renderItem={this._render}
            keyExtractor={(item, index) => index}
          /> :
          <EmptyComp
            urlImage={require('../assets/images/open-book.png')}
            msg='ไม่พบประวัติคำสั่งซื้อ'
          />
        }
      </View>
    );
  }

  _render = (item) => {
    return (
      <ItemCard
        title={item.item.status === 'R' ? 'ทำรายการไม่สำเร็จ' : 'รับจองเรียบร้อย'}
        titleColor={item.item.status === 'R' ? 'red' : 'green'}
        productName={item.item.productName}
        orderNo={item.item.orderNo}
        bookingTime={item.item.bookingTime}
        urlImage={item.item.urlImage}
        onPress={() => this.nextPage(item.item)}
      />
    )
  }

  nextPage = (item) => {
    this.props.navigation.navigate("Detail", { item: item })
  }
}

LinksScreen.navigationOptions = {
  title: 'ประวัติคำสั่งซื้อ',
  headerTitleStyle: {
    fontFamily: "kanit-bold",
    fontWeight: "normal"
  }
};