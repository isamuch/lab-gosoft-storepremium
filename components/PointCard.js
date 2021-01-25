import React, { Component } from 'react';
import {
    View,
} from 'react-native';
import MyAppText from '../components/MyAppText';
import MyAppTextBold from '../components/MyAppTextBold';

export default class PointCard extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <View style={{ flexDirection: 'row', padding: 10, marginHorizontal: 10, marginTop: 10, backgroundColor: '#f6f6f6' }}>
                <View style={{ flex: 1 }}>
                    <MyAppTextBold msg='ราคา' />
                    <MyAppText msg={this.props.price} />
                </View>
                <View style={{ flex: 1 }}>
                    <MyAppTextBold msg='แต้ม' />
                    <MyAppText msg={this.props.point} />
                </View>
                <View style={{ flex: 1 }}>
                    <MyAppTextBold msg='แสตมป์' />
                    <MyAppText msg={this.props.stamp} />
                </View>
            </View>
        );
    }
}