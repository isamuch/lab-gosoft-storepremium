import Constants from 'expo-constants';
import React from 'react';
import {
    Image,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Modal
} from 'react-native';

// Component
import LineItem from '../components/LineItem';
import EmptyComp from '../components/EmptyComp';

export default class AboutScreen extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            modalVisible: false,
        }
    }

    render() {
        const { manifest = {} } = Constants;
        const sections = [
            { data: [{ value: manifest.version }], title: 'version' },
        ];

        return (
            <View>
                {ListHeader()}
                <View style={{ marginLeft: 10, marginRight: 10 }}>
                    <LineItem
                        title={'Version'}
                        value={'1.0.0'}
                        bgColor='#f6f6f6'
                    />
                    <LineItem
                        title={'Copyright'}
                        value={'© 2019 by Gosoft.'}
                        bgColor='white'
                    />
                    <TouchableOpacity
                        onPress={() => this.setModalVisible(true)}
                    >
                        <LineItem
                            title={'Credits'}
                            // value={'1.0.0'}
                            bgColor='#f6f6f6'
                        />
                    </TouchableOpacity>

                    <Modal
                        animationType="slide"
                        transparent={false}
                        visible={this.state.modalVisible}
                        onRequestClose={() => { this.setModalVisible(!this.state.modalVisible) }}
                    >
                        <LineItem
                            title={'Libary'}
                            bgColor='#f6f6f6'
                        />
                        <Text style={{ fontFamily: 'kanit', fontSize: 18, }}>  - Momen.js</Text>
                        <Text style={{ fontFamily: 'kanit', fontSize: 18, }}>  - React Native Loading Spinner Overlay</Text>

                        <LineItem
                            title={'Image'}
                            bgColor='#f6f6f6'
                        />
                        <View style={{ padding: 10 }}>
                            <EmptyComp
                                urlImage={require('../assets/images/box.png')}
                                msg='designed by Freepik from Flaticon'
                            />
                            <EmptyComp
                                urlImage={require('../assets/images/open-book.png')}
                                msg='designed by Freepik from Flaticon'
                            />
                        </View>
                    </Modal>
                </View>
            </View>
        );
    }

    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }

}

const ListHeader = () => {
    const { manifest } = Constants;

    return (
        <View style={styles.titleContainer}>
            <View style={styles.titleIconContainer}>
                <AppIconPreview iconUrl={manifest.iconUrl} />
            </View>

            <View style={styles.titleTextContainer}>
                <Text style={styles.nameText} numberOfLines={1}>
                    {manifest.name}
                </Text>

                <Text style={styles.slugText} numberOfLines={1}>
                    {manifest.slug}
                </Text>

                <Text style={styles.descriptionText}>{manifest.description}</Text>
            </View>
        </View>
    );
};

const AppIconPreview = ({ iconUrl }) => {
    if (!iconUrl) {
        iconUrl = 'https://s3.amazonaws.com/exp-brand-assets/ExponentEmptyManifest_192.png';
    }

    return <Image source={{ uri: iconUrl }} style={{ width: 64, height: 64 }} resizeMode="cover" />;
};

const styles = StyleSheet.create({
    titleContainer: {
        paddingHorizontal: 15,
        paddingTop: 15,
        paddingBottom: 15,
        flexDirection: 'row',
    },
    titleIconContainer: {
        marginRight: 15,
        paddingTop: 2,
    },
    nameText: {
        fontWeight: '600',
        fontSize: 18,
    },
    slugText: {
        color: '#a39f9f',
        fontSize: 14,
        backgroundColor: 'transparent',
    },
    descriptionText: {
        fontSize: 14,
        marginTop: 6,
        color: '#4d4d4d',
    },
});

AboutScreen.navigationOptions = {
    title: 'เกี่ยวกับ',
    headerTitleStyle: {
        fontFamily: "kanit-bold",
        fontWeight: "normal"
    }
};