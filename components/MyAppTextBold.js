import React, { Component } from 'react';
import { Text } from 'react-native';

export default class MyAppTextBold extends Component {
    render() {
        return (
            <Text style={{ fontFamily: 'kanit-bold', color: this.props.fontColor }}>
                {this.props.msg}
            </Text>
        );
    }
}