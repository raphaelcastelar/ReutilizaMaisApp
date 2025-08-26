import React, { useState, useCallback } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, StyleSheet, Text, Button } from 'react-native';
import Toast from 'react-native-toast-message';
import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';


import BoasVindasTela from './screens/BoasVindasTela'
import LoginTela from './screens/LoginTela'
import CadastroForm from './screens/CadastroForm';
import EnderecoForm from './screens/EnderecoForm';
import CadastroConfirmacao from './screens/CadastroConfirmacao';



// Função para transição de "fade"
const forFade = ({ current }) => ({
  cardStyle: {
    opacity: current.progress,
  },
});

const Stack = createStackNavigator();

// Impedir que a tela de splash seja escondida automaticamente
SplashScreen.preventAutoHideAsync();

const App = () => {
  const [currentRoute, setCurrentRoute] = useState(null);
  const [fontsLoaded, fontError] = useFonts({
    'Poppins-Bold': require('./assets/fonts/Poppins-ExtraBold.ttf'),
    'Poppins-Medium': require('./assets/fonts/Poppins-Medium.ttf'),
    'Poppins-Regular': require('./assets/fonts/Poppins-Regular.ttf'),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <>
      <NavigationContainer
        onReady={() => {
          const initialState = Stack.Navigator?.getRootState?.();
          if (initialState && initialState.routes && initialState.index !== undefined) {
            setCurrentRoute(initialState.routes[initialState.index].name);
          }
          onLayoutRootView();
        }}
        onStateChange={(state) => {
          if (state && state.routes && state.index !== undefined) {
            const routeName = state.routes[state.index].name;
            setCurrentRoute(routeName);
          }
        }}
      >
        <Stack.Navigator
          initialRouteName="BoasVindasTela"
          screenOptions={{
            headerShown: false,
            cardStyleInterpolator: forFade,
            gestureEnabled: false,
            transitionSpec: {
              open: { animation: 'timing', config: { duration: 300 } },
              close: { animation: 'timing', config: { duration: 300 } },
            },
          }}
        >
          <Stack.Screen name="BoasVindasTela" component={BoasVindasTela} />
          <Stack.Screen name="LoginTela" component={LoginTela} />
          <Stack.Screen name ="CadastroForm" component={CadastroForm} />
          <Stack.Screen name ="EnderecoForm" component={EnderecoForm} />
          <Stack.Screen name ="CadastroConfirmacao" component={CadastroConfirmacao} />
        </Stack.Navigator>
      </NavigationContainer>
      <Toast />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 24,
    marginBottom: 20,
  },
  loginText: {
    fontSize: 20,
  },
});

AppRegistry.registerComponent(appName, () => App);

export default App;