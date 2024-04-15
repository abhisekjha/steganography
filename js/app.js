// Import necessary Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getAuth, signInWithRedirect, onAuthStateChanged, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-storage.js";

// Firebase configuration
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
const storage = getStorage(app);

// Handle file upload form submission
document.getElementById('file-upload-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    const pFile = document.getElementById('plaintext-file').files[0];
    const mFile = document.getElementById('secret-message-file').files[0];
    if (pFile && mFile) {
        const pUrl = await uploadFile(pFile);
        const mUrl = await uploadFile(mFile);
        if (pUrl && mUrl) {
            performSteganography(pUrl, mUrl);  // Assuming you will process URLs for demonstration
        }
    } else {
        alert("Please select both a plaintext file and a message file.");
    }
});

// Upload a file to Firebase Storage and return the URL
async function uploadFile(file) {
    const fileRef = ref(storage, `uploads/${file.name}`);
    try {
        const snapshot = await uploadBytes(fileRef, file);
        const url = await getDownloadURL(snapshot.ref);
        console.log(`File uploaded! URL: ${url}`);
        return url;
    } catch (error) {
        console.error("Error uploading file:", error);
        alert("Error uploading file: " + error.message);
        return null;
    }
}

// Perform steganography on the uploaded files (Placeholder function)
function performSteganography(pUrl, mUrl) {
    console.log(`Perform steganography with ${pUrl} and ${mUrl}`);
    
    // Fetch the plaintext image to be used as the steganography medium
    fetch(pUrl)
    .then(response => response.blob())
    .then(imageBlob => {
        // Convert image blob to an Image object to be used in a canvas
        const img = new Image();
        img.src = URL.createObjectURL(imageBlob);
        img.onload = () => {
            // Create a canvas and get its context
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            // Fetch the secret message file
            fetch(mUrl)
            .then(response => response.text())
            .then(text => {
                // Convert text to binary data
                const binaryMessage = text.split('').map(char => {
                    return char.charCodeAt(0).toString(2).padStart(8, '0');
                }).join('');
                
                // Encode the binary data into the image using the LSB method
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                let data = imageData.data;  // the array of pixels in RGBA

                let dataIndex = 0;
                for (let i = 0; i < binaryMessage.length; i++) {
                    // Modify the LSB of each pixel component (RGBA)
                    const bit = binaryMessage[i];
                    // Ensure we're modifying only the first three components (RGB) and not alpha
                    if (dataIndex % 4 !== 3) {
                        data[dataIndex] = (data[dataIndex] & ~1) | parseInt(bit);
                    }
                    dataIndex++;
                }

                // Put the modified image data back on the canvas
                ctx.putImageData(imageData, 0, 0);

                // Create an image element to display the steganographic image
                const resultImg = document.createElement('img');
                resultImg.src = canvas.toDataURL();
                document.getElementById('gallery').appendChild(resultImg);
                
                console.log("Steganography process completed. Image is displayed in the gallery.");
            });
        };
    })
    .catch(error => console.error('Error in processing the image or message:', error));
}


// Display the processed file in the gallery
function displayEncodedFile(fileContent, fileType) {
    const gallery = document.getElementById('gallery');
    gallery.innerHTML = '';  // Clear previous content
    let element;
    if (fileType.startsWith('image')) {
        element = document.createElement('img');
        element.src = URL.createObjectURL(fileContent);
    } else if (fileType.startsWith('video')) {
        element = document.createElement('video');
        element.src = URL.createObjectURL(fileContent);
        element.controls = true;
    } else if (fileType === 'text/plain') {
        element = document.createElement('textarea');
        element.textContent = new TextDecoder("utf-8").decode(fileContent);
        element.rows = 10;
        element.cols = 50;
        element.disabled = true;  // Make it read-only
    } else {
        alert('Unsupported file type for display.');
        return;
    }
    gallery.appendChild(element);
}

// Handle user authentication with Firebase
ddocument.getElementById('login-btn').addEventListener('click', () => {
    const provider = new GoogleAuthProvider();
    signInWithRedirect(auth, provider);
});

onAuthStateChanged(auth, (user) => {
    const uploadSection = document.getElementById('upload-section');
    const userInfoDisplay = document.getElementById('user-info');
    if (user) {
        console.log('User logged in:', user.displayName);
        userInfoDisplay.textContent = `Logged in as: ${user.displayName}`;
        uploadSection.style.display = 'block';
    } else {
        console.log('User not logged in.');
        userInfoDisplay.textContent = 'Not logged in';
        uploadSection.style.display = 'none';
    }
});
