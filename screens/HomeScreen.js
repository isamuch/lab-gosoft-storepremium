import React, { Component } from 'react'
import {
  FlatList,
  View,
  Image
} from 'react-native'

import * as Permissions from 'expo-permissions'

// Function
import { Notifications } from 'expo'
import { getUrlImage, listenerData, updateData } from '../function/firebaseHelper'

// Component
import ItemCard from '../components/ItemCard'
import MyAppText from '../components/MyAppText'
import EmptyComp from '../components/EmptyComp'

export default class HomeScreen extends Component {

  constructor(props) {
    super(props)

    this.state = {
      items: [],
      loadToken: false,
      token: "",
      message: "",
    }
  }

  componentDidMount() {
    listenerData('store-00005/transaction', (rawData) => this.setInformation(rawData))
    this.getToken()
  }

  setInformation = (rawData) => {
    let data = rawData.val()
    let arrData = []

    let promiseData = Object.keys(data).map(function (key, index) {
      return new Promise((resolve, reject) => {
        if (data[key].confirm === 'N') {
          getUrlImage('/itemList/' + data[key].pic)
            .then(url => {
              resolve(
                arrData.push({
                  'productName': data[key].product_name,
                  'orderNo': key,
                  'bookingTime': data[key].booking_timestamp,
                  'urlImage': url,
                  'transactionIdx': data[key].transaction_url,
                  'token': data[key].token
                })
              )
            })
        } else {
          resolve(
            // console.log('Not Push ' + key)
          )
        }
      })
    })

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

        {this.state.items != null && this.state.items.length !== 0 ?
          <FlatList
            data={this.state.items}
            renderItem={this._render}
            keyExtractor={(item, index) => index}
          /> :
          <EmptyComp
            urlImage={require('../assets/images/box.png')}
            msg='ไม่พบรายการคำสั่งซื้อ'
          />
        }
      </View>
    )
  }

  _render = (item) => {

    return (
      <ItemCard
        title={'รอการยืนยันจากร้านสาขา'}
        titleColor={'blue'}
        productName={item.item.productName}
        orderNo={item.item.orderNo}
        bookingTime={item.item.bookingTime}
        urlImage={item.item.urlImage}
        onPress={() => this.nextPage(item.item)}
      />
    )
  }

  nextPage = (item) => {
    this.props.navigation.navigate("Confirm", { item: item })
  }

  getToken = async () => {

    this.setState({ loadToken: true })
    const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS)
    let finalStatus = existingStatus

    if (existingStatus !== 'granted') {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS)
      finalStatus = status
    }

    if (finalStatus !== 'granted') {
      return
    }

    let token = await Notifications.getExpoPushTokenAsync()

    this.setState({ token: token })

    if (this.state.token != "") {
      this.setState({ loadToken: false })
    }

    const param = { 'store-00005': this.state.token }

    updateData('/userNoti', '/', param)

  }
}

HomeScreen.navigationOptions = {
  title: 'คำสั่งซื้อ',
  headerTitleStyle: {
    fontFamily: "kanit-bold",
    fontWeight: "normal"
  }
}