importScripts('https://www.gstatic.com/firebasejs/7.21.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.21.0/firebase-messaging.js');

firebase.initializeApp({
    apiKey: "AIzaSyBIFDLwLZHAmAjMoAcIZ-vYrbPf-Psro2w",
    authDomain: "firechat-6a92f.firebaseapp.com",
    projectId: "firechat-6a92f",
    storageBucket: "firechat-6a92f.appspot.com",
    messagingSenderId: "1011220467510",
    appId: "1:1011220467510:web:b4a21c67a16e8f77026d97",
    measurementId: "G-Q2K2738LV7",
    databaseURL: 'https://firechat-6a92f.firebaseio.com'
});

const messaging = firebase.messaging();