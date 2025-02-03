import React, { useEffect } from "react";
import { View, Text, ImageBackground, ActivityIndicator, StyleSheet } from "react-native";
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  useEffect(() => {
    setTimeout(() => {
      router.replace("/(auth)/login");
    }, 2000);
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <SafeAreaView style={styles.container} edges={['left', 'right']}>
        <ImageBackground source={require("@/assets/images/splash_screen.jpg")} style={styles.image} resizeMode="cover">
          <View style={styles.overlay}>
            <Text style={styles.text}>Loading...</Text>
            <ActivityIndicator size="large" color="#ffffff" />
          </View>
        </ImageBackground>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    justifyContent: 'center',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Optional: Adds a slight dark overlay
  },
  text: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
});
