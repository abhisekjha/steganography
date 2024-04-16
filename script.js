/ Function to handle encoding of message
function encodeMessage(event) {
    event.preventDefault();  // Prevent form submission and page reload

    var carrierFileInput = document.getElementsByName("plaintextFile")[0];
    var messageFile = document.getElementsByName("messageFile")[0].files[0];
    var carrierFile = carrierFileInput.files[0];
    if (!carrierFile || !messageFile) {
        alert("Please select both a carrier file and a message file.");
        return;
    }

    var startBit = parseInt(document.getElementById("startBit").value);
    var periodicity = parseInt(document.getElementById("periodicity").value);
    var fileExtension = carrierFile.name.split('.').pop();

    var reader = new FileReader();
    reader.onload = function(e) {
        var carrierBinary = fileToBinary(e.target.result);
        var messageReader = new FileReader();
        messageReader.onload = function(e) {
            var messageBinary = fileToBinary(e.target.result);
            var encodedBinary = encode(carrierBinary, messageBinary, startBit, periodicity);
            var encodedData = binaryToFile(encodedBinary);
            var mimeType = getMimeTypeByExtension(fileExtension);
            saveDataToFile(encodedData, carrierFile.name.replace(/\.[^/.]+$/, "") + "_encoded." + fileExtension, mimeType);
        };
        messageReader.readAsBinaryString(messageFile);
    };
    reader.readAsBinaryString(carrierFile);
}

// Function to handle decoding of message
function decodeMessage(event) {
    event.preventDefault();  // Prevent form submission and page reload

    var decodeFileInput = document.getElementsByName("decodeFile")[0];
    var decodeFile = decodeFileInput.files[0];
    if (!decodeFile) {
        alert("Please select a file to decode.");
        return;
    }

    var decodeStartBit = parseInt(document.getElementById("decodeStartBit").value);
    var decodePeriodicity = parseInt(document.getElementById("decodePeriodicity").value);
    var outputExtension = document.getElementById("outputExtension").value; // Get the user-selected file extension

    var reader = new FileReader();
    reader.onload = function(e) {
        var carrierBinary = fileToBinary(e.target.result);
        var decodedBinary = decode(carrierBinary, decodeStartBit, decodePeriodicity);
        var decodedData = binaryToFile(decodedBinary);
        var mimeType = getMimeTypeByExtension(outputExtension); // Use the selected extension for MIME type
        saveDataToFile(decodedData, "decoded_output." + outputExtension, mimeType); // Use the selected extension in the filename
    };
    reader.readAsBinaryString(decodeFile);
}


// Helper functions and utilities
function getMimeTypeByExtension(ext) {
    const mimeTypes = {
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'png': 'image/png',
        'gif': 'image/gif',
        'txt': 'text/plain',
        'pdf': 'application/pdf',
        'mp4': 'video/mp4',
        'mov': 'video/quicktime',
        'wav': 'audio/wav',
        // Add other file types as needed
    };
    return mimeTypes[ext.toLowerCase()] || 'application/octet-stream';
}

function fileToBinary(fileData) {
    var binary = '';
    for (var i = 0; i < fileData.length; i++) {
        binary += fileData.charCodeAt(i).toString(2).padStart(8, '0');
    }
    return binary;
}

function binaryToFile(binaryData) {
    var fileData = new Uint8Array(binaryData.length / 8);
    for (var i = 0; i < binaryData.length; i += 8) {
        fileData[i / 8] = parseInt(binaryData.substr(i, 8), 2);
    }
    return fileData;
}

function saveDataToFile(data, fileName, mimeType) {
    var blob = new Blob([data], { type: mimeType });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
}

// Core logic functions for steganography
function encode(carrierBinary, messageBinary, startBit, periodicity) {
    var encodedMessage = carrierBinary;  // Start with a copy of the carrier binary
    var messageIndex = 0;
    for (var i = startBit; i < carrierBinary.length; i += periodicity) {
        if (messageIndex >= messageBinary.length) break;
        encodedMessage = encodedMessage.substr(0, i) + messageBinary[messageIndex++] + encodedMessage.substr(i + 1);
    }
    return encodedMessage;
}

function decode(carrierBinary, startBit, periodicity) {
    var decodedMessage = '';
    for (var i = startBit; i < carrierBinary.length; i += periodicity) {
        decodedMessage += carrierBinary[i];
    }
    return decodedMessage;
}
