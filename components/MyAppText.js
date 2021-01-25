import React, { Component } from 'react';
import { Text } from 'react-native';

export default class MyAppText extends Component {
    render() {
        return (
            <Text style={{ fontFamily: 'kanit', fontSize: this.props.sizeMsg }}>
                {this.props.msg}
            </Text>
        );
    }
}