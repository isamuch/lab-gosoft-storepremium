import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import { AsyncStorage } from 'react-native';
import { updateData } from './firebaseHelper';

export async function getToken() {

    let myToken = await AsyncStorage.getItem('token');
    console.log('myToken: ', myToken)

    if (myToken != null && myToken !== '')

        this.setState({ loadToken: true })
    const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        finalStatus = status;
    }

    if (finalStatus !== 'granted') {
        return;
    }

    let token = await Notifications.getExpoPushTokenAsync();

    this.setState({ token: token })

    if (this.state.token != "") {
        this.setState({ loadToken: false })
    }

    const param = { 'store-00005': this.state.token }

    updateData('/userNoti', '/', param)

}