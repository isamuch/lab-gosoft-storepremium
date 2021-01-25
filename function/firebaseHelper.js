import firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyB6rhiakZ8JzVhAm9EXbG42hcpDEtuEg5E",
    authDomain: "allpremium-8a053.firebaseapp.com",
    databaseURL: "https://allpremium-8a053.firebaseio.com",
    projectId: "allpremium-8a053",
    storageBucket: "allpremium-8a053.appspot.com",
    messagingSenderId: "738447525141",
    appId: "1:738447525141:web:c91ec5e2459226255d951c",
    measurementId: "G-QGJN8CM0NC"
};

firebase.initializeApp(firebaseConfig);

export function listenerData(node, callback) {
    return firebase.database().ref(node).orderByChild('booking_timestamp').on('value', snap => callback(snap))
}

export function sendTransaction(node) {
    return firebase.database().ref(node).once('value')
}

export function getDataFromFirebase(node) {
    return new Promise((resolve) => {
        firebase.database().ref(node).once('value')
            .then(data => {
                resolve(data.val());
            })
    })
}

export function updateData(node, key, data) {
    return new Promise(resolve => {
        resolve(firebase.database().ref(node).child(key).update(data))
    })
}

export function getUrlImage(path) {
    return firebase.storage().ref(path).getDownloadURL()
}

export function getUrlFromCloudStorage(path) {
    // return firebase.storage().ref(path).getDownloadURL()
    return new Promise((resolve) => {
        firebase.storage().ref(path).getDownloadURL()
            .then(data => {
                resolve(data);
            })
    })
}

export async function uploadImage(key, uri) {
    const response = await fetch(uri);
    const blob = await response.blob();
    var ref = firebase.storage().ref().child(key);
    return Promise.resolve(ref.put(blob))
}