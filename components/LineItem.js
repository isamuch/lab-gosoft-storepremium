import React, { Component } from 'react';
import {
    View,
} from 'react-native';
import MyAppText from '../components/MyAppText';
import MyAppTextBold from '../components/MyAppTextBold';

export default class LineItem extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <View style={{ flexDirection: 'row', padding: 10, backgroundColor: this.props.bgColor }}>
                <View style={{ flex: 1 }}>
                    <MyAppTextBold msg={this.props.title} />
                </View>
                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                    <MyAppText msg={this.props.value} />
                </View>
            </View>
        );
    }
}