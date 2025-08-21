import React, { useState, useCallback } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, StyleSheet } from 'react-native';
import Toast from 'react-native-toast-message';
import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

// Importe suas telas
import CpfScreen from './screens/CpfScreen';
import PassScreen from './screens/PassScreen';
import CreatePassScreen from './screens/CreatePassScreen';
import HomePageScreen from './screens/HomepageScreen';
import NfsScreen from './screens/NfsScreen';
import DescriptionScreen from './screens/DescriptionScreen';
import DasScreen from './screens/DasScreen';
import DocumentScreen from './screens/DocumentScreen';
import SettingsScreen from './screens/SettingsScreen';
import MenuModal from './screens/MenuModal';
import ManageCNPJsScreen from './screens/ManageCNPJsScreen';
import ResetPasswordScreen from './screens/ResetPasswordScreen';
import UserSettingsScreen from './screens/UserSettingsScreen';
import BottomBarWrapper from './BottomBarWrapper';

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

  // Lista de telas onde a BottomBarWrapper deve ser escondida
  const hideBottomBarRoutes = [
    'CpfScreen',
    'PassScreen',
    'CreatePassScreen',
    'UserSettingsScreen',
    'MenuModal',
    'ResetPasswordScreen',
  ];

  return (
    <>
      <NavigationContainer
        onReady={() => {
          // Quando o NavigationContainer estiver pronto, definir a rota inicial
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
        <View style={styles.container}>
          <Stack.Navigator
            initialRouteName="CpfScreen"
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
            <Stack.Screen name="CpfScreen" component={CpfScreen} />
            <Stack.Screen name="PassScreen" component={PassScreen} />
            <Stack.Screen name="CreatePassScreen" component={CreatePassScreen} />
            <Stack.Screen name="HomePageScreen" component={HomePageScreen} />
            <Stack.Screen name="NfsScreen" component={NfsScreen} />
            <Stack.Screen name="DescriptionScreen" component={DescriptionScreen} />
            <Stack.Screen name="DasScreen" component={DasScreen} />
            <Stack.Screen name="DocumentScreen" component={DocumentScreen} />
            <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
            <Stack.Screen name="MenuModal" component={MenuModal} />
            <Stack.Screen name="ManageCNPJsScreen" component={ManageCNPJsScreen} />
            <Stack.Screen name="ResetPasswordScreen" component={ResetPasswordScreen} />
            <Stack.Screen name="UserSettingsScreen" component={UserSettingsScreen} />
          </Stack.Navigator>
          {/* Mostrar BottomBarWrapper apenas em rotas específicas */}
          {!hideBottomBarRoutes.includes(currentRoute) && (
            <BottomBarWrapper currentRoute={currentRoute} />
          )}
        </View>
      </NavigationContainer>
      <Toast />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

AppRegistry.registerComponent(appName, () => App);

export default App;