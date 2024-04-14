document.getElementById('file-upload-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const pFile = document.getElementById('plaintext-file').files[0];
    const mFile = document.getElementById('secret-message-file').files[0];
    const startBit = parseInt(document.getElementById('start-bit').value, 10);
    const periodicity = parseInt(document.getElementById('periodicity').value, 10);
    const mode = document.getElementById('mode').value;

    if (!pFile || !mFile) {
        alert("Please upload both a plaintext file and a message file.");
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const pContents = new Uint8Array(e.target.result);
        const mReader = new FileReader();
        mReader.onload = function(e) {
            const mContents = new Uint8Array(e.target.result);
            try {
                const encodedFile = encodeMessage(pContents, mContents, startBit, periodicity, mode, pFile.type);
                displayEncodedFile(encodedFile, pFile.type);
            } catch (error) {
                alert("Error encoding message: " + error.message);
            }
        };
        mReader.onerror = function() {
            alert("Error reading secret message file.");
        };
        mReader.readAsArrayBuffer(mFile);
    };
    reader.onerror = function() {
        alert("Error reading plaintext file.");
    };
    reader.readAsArrayBuffer(pFile);
});

function encodeMessage(pContents, mContents, startBit, periodicity, mode, fileType) {
    for (let i = startBit; i < mContents.length; i += periodicity) {
        if (i < pContents.length) {
            pContents[i] ^= mContents[i % mContents.length];  // Simple XOR encryption
        }
    }
    return new Blob([pContents], {type: fileType});
}

function displayEncodedFile(fileContent, fileType) {
    const gallery = document.getElementById('gallery');
    gallery.innerHTML = '';  // Clear previous content
    const url = URL.createObjectURL(fileContent);
    let element;
    if (fileType.startsWith('image')) {
        element = document.createElement('img');
        element.src = url;
    } else if (fileType.startsWith('video')) {
        element = document.createElement('video');
        element.src = url;
        element.controls = true;
    } else {
        alert('Unsupported file type for display.');
        return;
    }
    gallery.appendChild(element);
}

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, signInWithRedirect, onAuthStateChanged, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBBqg8nVlrinoWJo80w2DMiUFbpr6TOFcs",
  authDomain: "steganography-500aa.firebaseapp.com",
  projectId: "steganography-500aa",
  storageBucket: "steganography-500aa.appspot.com",
  messagingSenderId: "771055136605",
  appId: "1:771055136605:web:263bebb1def0a4161482b4",
  measurementId: "G-RPCZFQ8FMT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);  // Optional: Remove if you do not plan to use Analytics


document.getElementById('login-btn').addEventListener('click', function() {
    const provider = new GoogleAuthProvider();
    signInWithRedirect(auth, provider);
});

onAuthStateChanged(auth, (user) => {
    const loginSection = document.getElementById('login-section');
    const uploadSection = document.getElementById('upload-section');
    if (user) {
        console.log('User logged in: ', user.displayName);
        uploadSection.style.display = 'block';
        loginSection.style.display = 'none';
    } else {
        console.log('User not logged in.');
        uploadSection.style.display = 'none';
        loginSection.style.display = 'block';
    }
});
document.getElementById('login-btn').addEventListener('click', function() {
    const provider = new GoogleAuthProvider();
    signInWithRedirect(auth, provider);
});

onAuthStateChanged(auth, (user) => {
    const userInfoDisplay = document.getElementById('user-info');
    if (user) {
        console.log('User logged in: ', user.displayName);
        userInfoDisplay.textContent = `Logged in as: ${user.displayName}`;
    } else {
        console.log('User not logged in.');
        userInfoDisplay.textContent = 'Not logged in';
    }
});
