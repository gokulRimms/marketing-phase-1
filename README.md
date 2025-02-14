# RIMS MARKETING

This is a React Native project built with Expo.

## Setup Instructions

### Prerequisites
- Install [Node.js](https://nodejs.org/)
- Install [Expo CLI](https://docs.expo.dev/get-started/installation/)
- Install dependencies using npm or yarn

### Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/gokulRimms/marketing-phase-1.git
   cd marketing-phase-1
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
   or
   ```sh
   yarn install
   ```

### Environment Variables
Create a `.env` file in the root directory and add the following variables:
```env
EXPO_PUBLIC_API_URL='https://cocohospitals.online' // Only domain base URL
EXPO_PUBLIC_PUSHER_KEY='065ba8cbffac29'
```

### Running the Project
Start the Expo development server:
```sh
npx expo start
```

Scan the QR code with the Expo Go app or run it on an emulator.

### Building the App
For Android:
```sh
npx expo run:android
```
For iOS:
```sh
npx expo run:ios
```

### Generating APK
To generate an APK for Android:
```sh
npx eas build --profile preview --platform android
```

