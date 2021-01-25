import React, { Component } from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    StyleSheet,
    Dimensions
} from 'react-native';

import { Camera } from 'expo-camera';

import ButtonItem from './ButtonItem';
import MyAppText from '../components/MyAppText';

export default class CameraComponent extends Component {

    constructor(props) {
        super(props)

        this.state = {
            rejectReasonList: [],
            modalVisible: false,
            hasCameraPermission: null,
            type: Camera.Constants.Type.back,
        }
    }

    async componentDidMount() {
        Camera.Constants.AutoFocus;

        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({ hasCameraPermission: status === 'granted' });
    }

    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }

    _permission = () => {
        const { hasCameraPermission } = this.props;
        const win = Dimensions.get('window');

        if (hasCameraPermission === null) {
            return <Text>Null</Text>;
        } else if (hasCameraPermission === false) {
            return <Text>No access to camera</Text>;
        } else {
            return (
                <View>
                    <View>
                        <Camera
                            style={{ width: win.width - 20, height: win.width + 50 }}
                            type={this.state.type}
                            ref={ref => { this.camera = ref; }}
                        />
                    </View>
                    <View style={{ flexDirection: 'row', margin: 10 }}>
                        <ButtonItem
                            label='ปิด'
                            bgColor='red'
                            _onPress={() => this.setModalVisible(!this.state.modalVisible)}
                        />
                        <ButtonItem
                            label='ถ่ายรูป'
                            bgColor='#42A532'
                            _onPress={() => this.snap()}
                        />
                    </View>
                </View>
            );
        }
    }

    render() {
        return (
            <View style={{ marginTop: 22 }}>
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.modalVisible}
                    onRequestClose={() => { this.setModalVisible(!this.state.modalVisible) }}
                >
                    <View style={styles.container}>
                        {this._permission()}
                    </View>
                </Modal>

                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                    <TouchableOpacity
                        style={{ backgroundColor: '#CFCFCF', padding: 5, borderRadius: 5 }}
                        onPress={() => { this.setModalVisible(true) }}>
                        <MyAppText msg="อัพโหลด" />
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    snap = async () => {
        if (this.camera) {
            let photo = await this.camera.takePictureAsync({
                quality: 0.1
            })
            this.props.snap(photo.uri)
            this.setModalVisible(!this.state.modalVisible)
        }
    };
}

let styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 10,
        alignContent: 'center',
        justifyContent: 'center'
    }
})