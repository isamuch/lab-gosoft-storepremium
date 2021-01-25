import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import MyAppTextBold from '../components/MyAppTextBold';

export default class ButtonItem extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <TouchableOpacity style={[styles.buttonLayout, { backgroundColor: this.props.bgColor }]} onPress={this.props._onPress}>
                    <MyAppTextBold msg={this.props.label} fontColor={this.props.fontColor} />
                </TouchableOpacity>
            </View>
        );
    }
}

let styles = StyleSheet.create({
    buttonLayout: {
        alignItems: 'center',
        padding: 20,
        margin: 5,
        borderRadius: 5
    }
})