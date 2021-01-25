import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Image,
    Dimensions
} from 'react-native';

import MyAppTextBold from '../components/MyAppTextBold'

export default class DetailCard extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const win = Dimensions.get('window');
        const ratio = win.height / 2;
        return (
            <View style={styles.container}>
                <MyAppTextBold msg={this.props.title} />
                <Image
                    style={this.props.isBill ? { height: ratio } : { height: ratio }}
                    source={{ uri: this.props.urlAllmemberBarcode }}
                    resizeMode={'contain'}
                />
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        margin: 10,
        padding: 10,
        backgroundColor: '#f6f6f6',
        flexDirection: 'column',
    }
});