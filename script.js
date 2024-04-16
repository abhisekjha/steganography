// Function to handle encoding of message
function encodeMessage() {
    // Get input values
    var plaintextFile = document.getElementsByName("plaintextFile")[0].files[0];
    var messageFile = document.getElementsByName("messageFile")[0].files[0];
    var startBit = parseInt(document.getElementById("startBit").value);
    var periodicity = parseInt(document.getElementById("periodicity").value);
  
    // Read files
    var reader = new FileReader();
    reader.onload = function(e) {
      var plaintextBinary = fileToBinary(e.target.result);
      var messageReader = new FileReader();
      messageReader.onload = function(e) {
        var messageBinary = fileToBinary(e.target.result);
        // Encode message
        var encodedMessage = encode(plaintextBinary, messageBinary, startBit, periodicity);
        // Convert encoded message back to original format
        var encodedFile = binaryToFile(encodedMessage);
        // Save or display the encoded file
      };
      messageReader.readAsBinaryString(messageFile);
    };
    reader.readAsBinaryString(plaintextFile);
  }
  
  // Function to handle decoding of message
  function decodeMessage() {
    // Get input values
    var decodeFile = document.getElementsByName("decodeFile")[0].files[0];
    var decodeStartBit = parseInt(document.getElementById("decodeStartBit").value);
    var decodePeriodicity = parseInt(document.getElementById("decodePeriodicity").value);
  
    // Read decode file
    var reader = new FileReader();
    reader.onload = function(e) {
      var decodeBinary = fileToBinary(e.target.result);
      // Decode message
      var decodedMessage = decode(decodeBinary, decodeStartBit, decodePeriodicity);
      // Convert decoded message back to original format
      var decodedFile = binaryToFile(decodedMessage);
      // Save or display the decoded file
    };
    reader.readAsBinaryString(decodeFile);
  }
  
  // Helper function to convert file to binary string
  function fileToBinary(fileData) {
    var binary = '';
    for (var i = 0; i < fileData.length; i++) {
      binary += fileData.charCodeAt(i).toString(2).padStart(8, '0');
    }
    return binary;
  }
  
  // Helper function to convert binary string to file
  function binaryToFile(binaryData) {
    var fileData = '';
    for (var i = 0; i < binaryData.length; i += 8) {
      fileData += String.fromCharCode(parseInt(binaryData.substr(i, 8), 2));
    }
    return fileData;
  }
  
// Function to encode message into carrier using start bit and periodicity
function encode(carrierBinary, messageBinary, startBit, periodicity) {
    // Initialize variables
    var encodedMessage = '';
  
    // Copy the carrier binary to the encoded message
    encodedMessage = carrierBinary;
  
    // Counter for tracking the position in the message binary
    var messageIndex = 0;
  
    // Loop through the carrier binary, starting from the specified start bit
    for (var i = startBit; i < carrierBinary.length; i += periodicity) {
      // Replace the bit in the carrier with the bit from the message
      encodedMessage = encodedMessage.substr(0, i) + messageBinary[messageIndex] + encodedMessage.substr(i + 1);
      
      // Move to the next bit in the message binary
      messageIndex++;
  
      // If we have reached the end of the message binary, break the loop
      if (messageIndex >= messageBinary.length) {
        break;
      }
    }
  
    // Return the encoded message
    return encodedMessage;
  }
 // Function to decode message from carrier using start bit and periodicity
function decode(carrierBinary, startBit, periodicity) {
    // Initialize variables
    var decodedMessage = '';

    // Loop through the carrier binary, starting from the specified start bit
    for (var i = startBit; i < carrierBinary.length; i += periodicity) {
        // Extract the bit from the carrier and add it to the decoded message
        decodedMessage += carrierBinary[i];
    }

    // Return the decoded message
    return decodedMessage;
}
 