import React from 'react';
import { useNavigation } from '@react-navigation/native';
import BottomBar from './BottomBar';

const BottomBarWrapper = ({ currentRoute }) => {
  const navigation = useNavigation();
  //console.log('Current Route in BottomBarWrapper:', currentRoute); // Log para depuração
  // Se currentRoute for null, assumir que estamos em uma tela inicial (ex.: CpfScreen)
  const route = currentRoute || 'CpfScreen';
  const hideBottomBar = ['CpfScreen', 'PassScreen', 'CreatePassScreen'].includes(route);

  return !hideBottomBar ? <BottomBar navigation={navigation} currentRoute={route} /> : null;
};

export default BottomBarWrapper;