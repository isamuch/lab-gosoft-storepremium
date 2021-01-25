import React, { Component } from 'react';
import {
    View,
    ScrollView,
    Picker,
    StyleSheet,
    Alert,
    Keyboard
} from 'react-native';

import * as Permissions from 'expo-permissions';

// Coponent
import DetailCard from '../components/detailCard'
import ItemCard from '../components/ItemCard';
import MyAppText from '../components/MyAppText';
import MyAppTextBold from '../components/MyAppTextBold';
import LineItem from '../components/LineItem';
import ButtonItem from '../components/ButtonItem';
import CameraComp from '../components/Camera';
import LoadingComp from '../components/LoadingComp';

// Service
import {
    getDataFromFirebase,
    getUrlFromCloudStorage,
    updateData,
    uploadImage
} from '../function/firebaseHelper'

// Lib
import { Camera } from 'expo-camera';
import Spinner from 'react-native-loading-spinner-overlay';

export default class ConfirmScreen extends Component {

    constructor(props) {
        super(props)

        this.state = {
            hasCameraPermission: null,
            type: Camera.Constants.Type.back,
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
                urlAllmemberBarcode: null
            },
            rejectReasonList: [],
            modalVisible: false,
            spinner: false
        }
    }

    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }

    async componentDidMount() {
        this.getTransacation()
        this.getReasonReject()

        Camera.Constants.AutoFocus;
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({ hasCameraPermission: status === 'granted' });

        // setInterval(() => {
        //     this.setState({
        //         spinner: !this.state.spinner
        //     });
        // }, 3000);
    }

    getTransacation = () => {
        getDataFromFirebase(this.state.productInfo.transactionIdx)
            .then(data => this.setData(data))
            .then(data => {
                let objAdd = this.state.bookingInfo
                objAdd.urlAllmemberBarcode = data

                this.setState({
                    bookingInfo: objAdd
                })
            })
    }

    getReasonReject = () => {
        getDataFromFirebase('/reason_reject')
            .then(data => {
                this.setState({
                    rejectReasonList: data
                })
            })
    }

    setData = (data) => {
        this.setState({
            bookingInfo: {
                name: `${data.firstname} ${data.lastname}`,
                phone: data.phone,
                bookingBy: data.booking_by,
                bookingValue: data.booking_value,
            }
        })
        return Promise.resolve(getUrlFromCloudStorage('/allmembarcode/' + data.allmem_barcode_pic))
    }

    submit = (action) => {
        if (action === 'A') {
            this.approveProcess()
        } else {
            this.rejectProcess()
        }
    }

    rejectProcess = () => {
        let key = this.state.productInfo.transactionIdx.replace('tb_user/', '')

        if (this.state.rejectReason === 'ไม่ระบุ') {
            Alert.alert('การยกเลิกคำสั่งซื้อไม่ถูกต้อง !', 'กรุณาระบุเหตุผลการยกเลิกคำสั่งซื้อ', [{ text: 'ตกลง' },], { cancelable: true });
        } else {
            let dataTransactionReject = {
                order_status: this.state.rejectReason === 'สินค้าหมด' ? 'D' : 'R',
                reason_reject: this.state.rejectReason,
                confirm_timestamp: new Date().getTime()
            }

            let dataTransactionStore = {
                confirm: 'R'
            }

            Alert.alert('ยกเลิกคำสั่งซื้อ ?', 'คุณต้องการยกเลิกคำสั่งซื้อใช่หรือไม่',
                [
                    { text: 'ยกเลิก', style: 'cancel', },
                    {
                        text: 'ตกลง', onPress: () => {
                            this.setState({ spinner: true });
                            let updateTranOrder = updateData('tb_user/', key, dataTransactionReject)
                            let updateTranStore = updateData('store-00005/', 'transaction/' + this.state.productInfo.orderNo, dataTransactionStore)
                            let sendMessage = this.sendMessage('คำสั่งซื้อถูกยกเลิก', 'คำสั่งซื้อเลขที่ ' + this.state.productInfo.orderNo + ' ของคุณถูกยกเลิก')

                            Promise.all([updateTranOrder, updateTranStore, sendMessage])
                                .then(() => {
                                    this.setState({ spinner: false });
                                    Alert.alert('ยกเลิกคำสั่งซื้อสำเร็จ', 'ยกเลิกคำสั่งซื้อเรียบร้อยแล้ว',
                                        [
                                            { text: 'ตกลง', onPress: () => this.props.navigation.popToTop() }
                                        ],
                                        { cancelable: false }
                                    )
                                })
                        }
                    }
                ]
            );
        }
    }

    approveProcess = () => {
        let key = this.state.productInfo.transactionIdx.replace('tb_user/', '')

        if (this.state.urlPhoto === '' || this.state.urlPhoto == null) {
            Alert.alert('การอนุมัติคำสั่งซื้อไม่ถูกต้อง !', 'กรุณาระบุรูปภาพใบเสร็จสินค้า', [{ text: 'ตกลง' },], { cancelable: true });
        } else {
            let dataTransaction = {
                order_status: 'C',
                confirm_timestamp: new Date().getTime()
            }

            let dataTransactionStore = {
                confirm: 'C'
            }

            Alert.alert('อนุมัติคำสั่งซื้อ ?', 'คุณต้องการอนุมัติคำสั่งซื้อใช่หรือไม่',
                [
                    { text: 'ยกเลิก', style: 'cancel', },
                    {
                        text: 'ตกลง', onPress: () => {
                            this.setState({ spinner: true });
                            dataTransaction.invoice_pic = this.props.navigation.state.params.item.orderNo + '.jpg'

                            let updateTranOrder = updateData('tb_user/', key, dataTransaction)
                            let updateTranStore = updateData('store-00005/', 'transaction/' + this.state.productInfo.orderNo, dataTransactionStore)
                            let upload = uploadImage("eslip/" + dataTransaction.invoice_pic, this.state.urlPhoto)
                            let sendMessage = this.sendMessage('คำสั่งซื้อสำเร็จ', 'คำสั่งซื้อเลขที่ ' + this.state.productInfo.orderNo + ' ของคุณดำเนินการเรียบร้อย')

                            Promise.all([updateTranOrder, updateTranStore, upload, sendMessage])
                                .then(() => {
                                    this.setState({ spinner: false });
                                    Alert.alert('อนุมัติคำสั่งซื้อสำเร็จ', 'อนุมัติคำสั่งซื้อเรียบร้อยแล้ว',
                                        [
                                            { text: 'ตกลง', onPress: () => this.props.navigation.popToTop() }
                                        ],
                                        { cancelable: false }
                                    )
                                })
                        }
                    },
                ]
            );
        }
    }

    render() {

        return (
            <ScrollView>
                <Spinner
                    visible={this.state.spinner}
                    textContent={'กรุณารอสักครู่...'}
                    textStyle={styles.spinnerTextStyle}
                />
                <View style={{ flex: 1 }}>
                    <ItemCard
                        title={'รอการยืนยันจากร้านสาขา'}
                        titleColor={'blue'}
                        productName={this.props.navigation.state.params.item.productName}
                        orderNo={this.props.navigation.state.params.item.orderNo}
                        bookingTime={this.props.navigation.state.params.item.bookingTime}
                        urlImage={this.props.navigation.state.params.item.urlImage}
                    />

                    <DetailCard
                        title='ALL member barcode'
                        urlAllmemberBarcode={this.state.bookingInfo.urlAllmemberBarcode}
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

                        <View style={{ flexDirection: 'column', padding: 10, backgroundColor: '#f6f6f6' }}>
                            <MyAppTextBold msg='เหตุผลการยกเลิก' />
                            <Picker
                                selectedValue={this.state.rejectReason}
                                style={{ fontFamily: 'kanit' }}
                                onValueChange={(itemValue, itemIndex) =>
                                    this.setState({ rejectReason: itemValue })
                                }>
                                {Object.keys(this.state.rejectReasonList).map((key) => {
                                    return (<Picker.Item label={this.state.rejectReasonList[key]} value={this.state.rejectReasonList[key]} key={key} />)
                                })}
                            </Picker>
                        </View>

                        <View style={{ flexDirection: 'column', padding: 10, backgroundColor: 'white' }}>
                            <MyAppTextBold msg='สลิป' />
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ flex: 1 }}>
                                    <MyAppText msg={this.state.urlPhoto} />
                                </View>
                                <CameraComp
                                    hasCameraPermission={this.state.hasCameraPermission}
                                    snap={(uri) => this.snap(uri)}
                                />
                            </View>
                        </View>

                        <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                            <ButtonItem
                                label='ส่งกลับ'
                                bgColor='red'
                                _onPress={() => this.submit('R')}
                            />
                            <ButtonItem
                                label='ยืนยัน'
                                bgColor='#42A532'
                                _onPress={() => this.submit('A')}
                            />
                        </View>

                    </View>
                </View>
            </ScrollView>

        )
    }

    snap = async (uri) => {
        this.setState({
            urlPhoto: uri
        })
    };

    sendMessage = (title, msg) => {
        return new Promise(resolve => {
            Keyboard.dismiss()

            let response = fetch('https://exp.host/--/api/v2/push/send', {
                method: 'POST',
                header: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    to: this.props.navigation.state.params.item.token,
                    sound: 'default',
                    title: title,
                    body: msg,
                }
                ),
                android: {
                    icon: '../assets/images/icons8-mario-8-bit-30.png'
                }
            })

            response
                .then((data) => {
                    resolve(data)
                })
        })
    }

}

let styles = StyleSheet.create({
    container: {
        flex: 1
    },
    spinnerTextStyle: {
        fontFamily: 'kanit',
        color: '#FFF'
    },
})

ConfirmScreen.navigationOptions = {
    title: 'รายละเอียดคำสั่งซื้อ',
    tabBarVisible: false,
    headerTitleStyle: {
        fontFamily: "kanit-bold",
        fontWeight: "normal"
    },
};