import React, { Component } from 'react';
import {
    View,
    Image
} from 'react-native';

import MyAppText from '../components/MyAppText';

export default class EmptyComp extends Component {
    render() {
        return (
            <View style={{ alignItems: 'center', paddingTop: 40 }}>
                <Image
                    style={{ width: 80, height: 80, backgroundColor: 'transparent' }}
                    source={this.props.urlImage}
                />
                <MyAppText
                    msg={this.props.msg}
                    sizeMsg={18}
                />
            </View>
        );
    }
}