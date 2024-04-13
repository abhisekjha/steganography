document.getElementById('file-upload-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const pFile = document.getElementById('plaintext-file').files[0];
    const mFile = document.getElementById('secret-message-file').files[0];
    const startBit = parseInt(document.getElementById('start-bit').value);
    const periodicity = parseInt(document.getElementById('periodicity').value);
    const mode = document.getElementById('mode').value;

    if (pFile && mFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const pContents = new Uint8Array(e.target.result);
            const mReader = new FileReader();
            mReader.onload = function(e) {
                const mContents = new Uint8Array(e.target.result);
                const encodedFile = encodeMessage(pContents, mContents, startBit, periodicity, mode);
                displayEncodedFile(encodedFile);
            };
            mReader.readAsArrayBuffer(mFile);
        };
        reader.readAsArrayBuffer(pFile);
    }
});

function encodeMessage(pContents, mContents, startBit, periodicity, mode) {
    // Steganography logic here
    // This is a placeholder to indicate where to implement the encoding logic
    return pContents; // This should be the modified pContents
}

function displayEncodedFile(fileContent) {
    // Convert the file content to a Blob and display it
    const blob = new Blob([fileContent], {type: 'image/jpeg'});
    const url = URL.createObjectURL(blob);
    const img = document.createElement('img');
    img.src = url;
    document.getElementById('gallery').appendChild(img);
}
// Firebase App (the core Firebase SDK) is always required and must be listed first
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getAuth, signInWithRedirect, signInWithEmailAndPassword, onAuthStateChanged, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.getElementById('login-btn').addEventListener('click', function() {
    const provider = new GoogleAuthProvider();
    signInWithRedirect(auth, provider);
});

onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log('User logged in: ', user.displayName);
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
    } else {
        // User is signed out
        console.log('User not logged in.');
    }
});
