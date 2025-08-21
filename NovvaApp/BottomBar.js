import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const BottomBar = ({ navigation, currentRoute }) => {
  const navigateToScreen = (screen) => {
    navigation.navigate(screen);
  };

  return (
    <View style={styles.bottomBar}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigateToScreen('HomePageScreen')}
      >
        <Ionicons
          name={currentRoute === 'HomePageScreen' ? 'home' : 'home-outline'}
          size={30}
          color={currentRoute === 'HomePageScreen' ? '#4A90E2' : '#888'}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigateToScreen('MenuModal')}
      >
        <Ionicons
          name={currentRoute === 'MenuModal' ? 'menu' : 'menu-outline'}
          size={30}
          color={currentRoute === 'MenuModal' ? '#4A90E2' : '#888'}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigateToScreen('SettingsScreen')}
      >
        <Ionicons
          name={currentRoute === 'SettingsScreen' ? 'settings' : 'settings-outline'}
          size={30}
          color={currentRoute === 'SettingsScreen' ? '#4A90E2' : '#888'}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  button: {
    padding: 10,
  },
});

export default BottomBar;