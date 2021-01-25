import React, { Component } from 'react';
import {
    Text,
    View,
    StyleSheet,
    Image,
    TouchableOpacity
} from 'react-native';
import Moment from 'moment';

export default class ItemCard extends Component {

    constructor(props) {
        super(props);
        Moment.locale('en');
    }

    render() {

        return (
            <TouchableOpacity onPress={this.props.onPress} disabled={this.props.onPress == null || this.props.onPress === '' ? true : false}>
                <View style={styles.container}>
                    <View style={styles.iconLayout}>
                        <Image
                            style={{ width: 70, height: 70, backgroundColor: 'transparent' }}
                            source={{ uri: this.props.urlImage }}
                        />
                    </View>
                    <View style={styles.contentLayout}>
                        <View style={styles.subContentHeadLayout}>
                            <Text style={[styles.titleTextContent, { color: this.props.titleColor }]}>{this.props.title}</Text>
                            {/* <Text style={{ fontFamily: 'kanit', fontSize: 10, flex: 1, textAlign: 'right' }}>{Moment(bookingTimeLong).format('DD/MM/YYYY HH:MM:SS')}</Text> */}
                        </View>
                        <View style={styles.subContentSubLayout}>
                            <Text style={styles.mainTextContent}>{this.props.productName}</Text>
                            <Text style={styles.subTextContent}>Order # {this.props.orderNo}</Text>
                            <Text style={styles.subTextContent}>Booking Time # {Moment(this.props.bookingTime).format('DD/MM/YYYY HH:mm')}</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}

const font = 'kanit';
const fontBold = 'kanit-bold';

const styles = StyleSheet.create({
    container: {
        height: 105,
        flexDirection: 'row',
        marginTop: 10,
        marginLeft: 10,
        marginRight: 10,
        borderRadius: 10,
        backgroundColor: '#f6f6f6'
    },
    contentLayout: {
        flex: 8,
        padding: 5,
    },
    subContentHeadLayout: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    subContentSubLayout: {
        margin: 2,
        flex: 1,
        backgroundColor: 'white',
        padding: 8,
        borderRadius: 5
    },
    iconLayout: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },
    titleTextContent: {
        fontFamily: fontBold
    },
    mainTextContent: {
        fontFamily: font
    },
    subTextContent: {
        fontSize: 10,
        fontFamily: font,
        color: '#7d7d7d'
    },
});