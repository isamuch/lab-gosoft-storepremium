import React, { Component } from 'react';
import {
    View,
    StyleSheet,
} from 'react-native';

import MyAppTextBold from '../components/MyAppTextBold'

export default class LoadingComp extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.container}>
                <MyAppTextBold msg={'hello'} />
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        width: 100,
        height: 80,
        backgroundColor: 'pink'
    }
});