# Steganography Application

## Overview
This web-based Steganography application allows users to securely encode and decode messages within various file formats such as images, videos, and audio files. It includes user authentication features to secure access and ensure that only authorized users can encode or decode messages.

## Access
Visit the live application here: [Steganography App](https://www.abhisekjha.com.np/steganography/)

## Key Features
- **User Authentication**: Secure login and registration system with email verification.
- **Encode Messages**: Hide messages within files using sophisticated encoding algorithms.
- **Decode Messages**: Extract hidden messages from files.
- **File Support**: Works with multiple file types including JPG, PNG, MP4, MOV, and WAV.

## Functionality

### Encoding
1. **Select Files**: Users choose a carrier file and a message file.
2. **Set Parameters**: Users input parameters like Start Bit and Periodicity.
3. **Encode**: The message is encoded into the carrier file, and the output retains the carrier's file format.

### Decoding
1. **Select File**: Users choose a file to decode.
2. **Set Parameters**: Users input decoding parameters and choose the output file format.
3. **Decode**: The hidden message is extracted and saved in the selected format.


2. **Open `index.html`** in your browser to start the application.

3. **Register and verify your email** to log in and use the encoding/decoding features.

## Usage

- **Login/Sign Up**: Authenticate using the login form provided on the home page. Verification is required for new users.
- **Navigate to Encode/Decode Tabs**: Once logged in, use the tabs to select either Encode or Decode operations.
- **Encoding**:
- Choose your carrier file and the message file.
- Set the encoding parameters.
- Click `Encode` to process and download the encoded file.
- **Decoding**:
- Upload

  - Specify the decoding parameters and select the desired output file format from the dropdown.
  - Click `Decode` to reveal and download the decoded message.

## Technical Details

### Authentication
- Firebase Authentication is used for managing user sessions and email verification.
- Users must verify their email addresses to access the encode and decode functionalities.

### Encoding Process
- The application takes two inputs for encoding:
  1. **Carrier File**: The file that will hide the message.
  2. **Message File**: The file containing the message to be hidden.
- Users must also specify:
  1. **Start Bit (S)**: The bit at which to begin the encoding.
  2. **Periodicity (L)**: The interval at which bits of the message will be embedded.
- The output is an encoded file of the same type as the carrier file.

### Decoding Process
- For decoding, users upload a previously encoded file and input the same parameters used during encoding (Start Bit and Periodicity).
- Users also select the output file format to determine the format of the extracted hidden message.
- The application then extracts and saves the hidden message in the chosen format.

## Security Features
- **Data Integrity**: By maintaining the original file format after encoding, the application ensures that the carrier file remains usable and its alteration is not easily detectable.
- **User Verification**: Mandatory email verification helps prevent unauthorized access and misuse of the encoding and decoding capabilities.

## Requirements
- A modern web browser with JavaScript enabled.
- Internet connection for authentication and to access Firebase services.

## Known Issues
- Large files may take significant time to encode or decode and could impact browser performance. Optimization for handling large files efficiently is planned for future updates.

## Contributing
Feel free to fork this repository and submit pull requests to contribute to its development.

Ensure to update tests as appropriate.

## License
Distributed under the MIT License. See `LICENSE` for more information.


