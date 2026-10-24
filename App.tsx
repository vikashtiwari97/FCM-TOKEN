import React, { useEffect } from 'react';
import {
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
  Platform,
  PermissionsAndroid,
  Alert,
} from 'react-native';

import { NewAppScreen } from '@react-native/new-app-screen';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import { getApp } from '@react-native-firebase/app';
import {
  getMessaging,
  getToken,
} from '@react-native-firebase/messaging';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    const setupFCM = async () => {
      try {
        console.log('Step 1: Starting FCM...');

        // Android 13+ notification permission
        if (
          Platform.OS === 'android' &&
          Number(Platform.Version) >= 33
        ) {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
          );

          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            console.log('Notification permission denied');
            return;
          }
        }

        // Get the default Firebase app and messaging instance
        const app = getApp();
        const messaging = getMessaging(app);

        console.log('Firebase app initialized:', app.name);
        console.log('Step 2: Generating FCM token...');

        const token = await getToken(messaging);

        if (token) {
          console.log('FCM Token:', token);
          Alert.alert('FCM Token Generated!', token);
        } else {
          console.log('FCM token is empty');
        }
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : String(error);

        console.error('FCM Token Error:', message);
        Alert.alert('FCM Error', message);
      }
    };

    setupFCM();
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
      />
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {
  const safeAreaInsets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <NewAppScreen
        templateFileName="App.tsx"
        safeAreaInsets={safeAreaInsets}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
