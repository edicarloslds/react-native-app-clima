import AsyncStorage from '@react-native-community/async-storage';
import Reactotron from 'reactotron-react-native';

console.disableYellowBox = true;

// set some configuration settings on how to connect to the app
Reactotron.setAsyncStorageHandler(AsyncStorage);
Reactotron.configure({
  name: 'App Clima',
});

// add every built-in react native feature.
Reactotron.useReactNative({
  asyncStorage: {ignore: ['secret']},
});

// if we're running in DEV mode, then let's connect!
if (__DEV__) {
  Reactotron.connect();
  Reactotron.clear();
}

console.tron = Reactotron;
