// Function to handle encoding of message
function encodeMessage(event) {
    event.preventDefault();
    const carrierFileInput = document.getElementsByName("plaintextFile")[0];
    const messageFile = document.getElementsByName("messageFile")[0].files[0];
    const carrierFile = carrierFileInput.files[0];
    if (!carrierFile || !messageFile) {
        alert("Please select both a carrier file and a message file.");
        return;
    }

    const startBit = parseInt(document.getElementById("startBit").value, 10);
    const periodicity = parseInt(document.getElementById("periodicity").value, 10);
    if (Number.isNaN(startBit) || Number.isNaN(periodicity) || startBit < 0 || periodicity <= 0) {
        alert("Invalid start bit or periodicity.");
        return;
    }

    const fileExtension = carrierFile.name.split('.').pop();
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const carrierBinary = fileToBinary(e.target.result);
            const messageReader = new FileReader();
            messageReader.onload = function(e) {
                try {
                    const messageBinary = fileToBinary(e.target.result);
                    const encodedBinary = encode(carrierBinary, messageBinary, startBit, periodicity);
                    const encodedData = binaryToFile(encodedBinary);
                    const mimeType = getMimeTypeByExtension(fileExtension);
                    saveDataToFile(encodedData, `${carrierFile.name.replace(/\.[^/.]+$/, "")}_encoded.${fileExtension}`, mimeType);
                } catch (error) {
                    alert(`Error processing message file: ${error.message}`);
                }
            };
            messageReader.readAsBinaryString(messageFile);
        } catch (error) {
            alert(`Error processing carrier file: ${error.message}`);
        }
    };
    reader.readAsBinaryString(carrierFile);
}

// Function to handle decoding of message
function decodeMessage(event) {
    event.preventDefault();

    const decodeFileInput = document.getElementsByName("decodeFile")[0];
    const decodeFile = decodeFileInput.files[0];
    if (!decodeFile) {
        alert("Please select a file to decode.");
        return;
    }

    const decodeStartBit = parseInt(document.getElementById("decodeStartBit").value, 10);
    const decodePeriodicity = parseInt(document.getElementById("decodePeriodicity").value, 10);
    const outputExtension = document.getElementById("outputExtension").value;

    const reader = new FileReader();
    reader.onload = function(e) {
        const carrierBinary = fileToBinary(e.target.result);
        const decodedBinary = decode(carrierBinary, decodeStartBit, decodePeriodicity);
        const decodedData = binaryToFile(decodedBinary);
        const mimeType = getMimeTypeByExtension(outputExtension);
        saveDataToFile(decodedData, `decoded_output.${outputExtension}`, mimeType);
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
    return Array.from(new Uint8Array(fileData))
        .map(byte => byte.toString(2).padStart(8, '0')).join('');
}

function binaryToFile(binaryData) {
    const bytes = new Uint8Array(binaryData.length / 8);
    for (let i = 0; i < binaryData.length; i += 8) {
        bytes[i / 8] = parseInt(binaryData.substring(i, i + 8), 2);
    }
    return bytes.buffer;
}

function saveDataToFile(data, fileName, mimeType) {
    const blob = new Blob([data], {type: mimeType});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Core logic functions for steganography
function encode(carrierBinary, messageBinary, startBit, periodicity) {
    let encodedMessage = carrierBinary;
    for (let i = startBit; i < carrierBinary.length && i < messageBinary.length * periodicity; i += periodicity) {
        encodedMessage = encodedMessage.substring(0, i) + messageBinary[Math.floor((i - startBit) / periodicity)] + encodedMessage.substring(i + 1);
    }
    return encodedMessage;
}

function decode(carrierBinary, startBit, periodicity) {
    let decodedMessage = '';
    for (let i = startBit; i < carrierBinary.length; i += periodicity) {
        decodedMessage += carrierBinary[i];
    }
    return decodedMessage;
}
