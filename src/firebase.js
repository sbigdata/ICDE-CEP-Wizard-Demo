import firebase from 'firebase'

// Initialize Firebase
const config = {
    apiKey: "AIzaSyBKnFnLaUEdNNh-sylmmuu5a4xbzbzzdaU",
    authDomain: "cep-wizard.firebaseapp.com",
    databaseURL: "https://cep-wizard.firebaseio.com",
    projectId: "cep-wizard",
    storageBucket: "cep-wizard.appspot.com",
    messagingSenderId: "674956591343"
}

firebase.initializeApp(config)

export const database = firebase.database()

