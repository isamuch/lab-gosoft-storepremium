import React, { Component } from 'react';
import {
    View,
    ScrollView,
} from 'react-native';

// Coponent
import DetailCard from '../components/detailCard'
import ItemCard from '../components/ItemCard';
import LineItem from '../components/LineItem';

// Service
import {
    getDataFromFirebase,
    getUrlFromCloudStorage,
} from '../function/firebaseHelper'

export default class DetailHistory extends Component {

    constructor(props) {
        super(props)

        this.state = {
            rejectReason: '',
            urlPhoto: null,
            productInfo: {
                productName: this.props.navigation.state.params.item.productName,
                orderNo: this.props.navigation.state.params.item.orderNo,
                bookingTime: this.props.navigation.state.params.item.bookingTime,
                urlImage: this.props.navigation.state.params.item.urlImage,
                transactionIdx: this.props.navigation.state.params.item.transactionIdx,
            },
            bookingInfo: {
                name: null,
                phone: null,
                bookingBy: null,
                bookingValue: null,
                urlBill: null
            },
        }
    }

    componentDidMount() {
        this.getTransacation()
    }

    getTransacation = () => {
        getDataFromFirebase(this.state.productInfo.transactionIdx)
            .then(data => this.setData(data))
    }

    setData = (data) => {
        this.setState({
            bookingInfo: {
                name: `${data.firstname} ${data.lastname}`,
                phone: data.phone,
                bookingBy: data.booking_by,
                bookingValue: data.booking_value,
                reasonReject: data.reason_reject
            }
        }, () => {
            if (data.order_status === 'C') {

                console.log('/eslip/' + data.invoice_pic)

                getUrlFromCloudStorage('/eslip/' + data.invoice_pic)
                    .then(url => {
                        console.log(url)
                        let objAdd = this.state.bookingInfo
                        objAdd.urlBill = url
                        this.setState({ bookingInfo: objAdd })
                    })
            }
        })
    }

    render() {

        let { status } = this.props.navigation.state.params.item;
        return (
            <ScrollView>
                <View style={{ flex: 1 }}>
                    <ItemCard
                        title={status === 'R' ? 'ทำรายการไม่สำเร็จ' : 'รับจองเรียบร้อย'}
                        titleColor={status === 'R' ? 'red' : 'green'}
                        productName={this.props.navigation.state.params.item.productName}
                        orderNo={this.props.navigation.state.params.item.orderNo}
                        bookingTime={this.props.navigation.state.params.item.bookingTime}
                        urlImage={this.props.navigation.state.params.item.urlImage}
                    />

                    <View style={{ marginLeft: 10, marginRight: 10, flex: 1 }}>

                        <LineItem
                            title={this.state.bookingInfo.bookingBy === 'M' ? 'M-Stamp (บาท)' : 'All Member Point (แต้ม)'}
                            value={this.state.bookingInfo.bookingValue}
                            bgColor='white'
                        />

                        <LineItem
                            title='ชื่อผู้จอง'
                            value={this.state.bookingInfo.name}
                            bgColor='#f6f6f6'
                        />

                        <LineItem
                            title='เบอร์โทรศัพท์'
                            value={this.state.bookingInfo.phone}
                            bgColor='white'
                        />

                        {status === 'R' ?
                            <LineItem
                                title='เหตุผลการยกเลิก'
                                value={this.state.bookingInfo.reasonReject}
                                bgColor='#f6f6f6'
                            /> : null}
                    </View>
                    {status === 'C' ?
                        <View style={{ marginTop: -10 }}>
                            <DetailCard
                                title='ใบเสร็จรับของ'
                                urlAllmemberBarcode={this.state.bookingInfo.urlBill}
                                isBill={true}
                            />
                        </View>
                        : null}
                </View>
            </ScrollView>

        )
    }

}

DetailHistory.navigationOptions = {
    title: 'รายละเอียดคำสั่งซื้อ',
    headerTitleStyle: {
        fontFamily: "kanit-bold",
        fontWeight: "normal"
    }
};