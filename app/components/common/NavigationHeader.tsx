import React from 'react'
import { StyleSheet, Text, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { IconButton } from './IconButton';
import { Colors } from '../../constants/Styles';
import { isRTL } from '../../assets/translation/resources';
import { fontsAR, fontsEN } from '../../constants/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '../../AppNavigation';
import ArrowBack from '../../assets/svgs/move-left.svg';
import Logout from '../../assets/svgs/log-out.svg';

interface NavigationHeaderProps {
  title: string;
  showArrow?: boolean;
  showLogoutIcon?: boolean;
}

export const NavigationHeader = ({ title, showArrow, showLogoutIcon }: NavigationHeaderProps) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const goBackHandler = () => {
    navigation.goBack();
  };

  const logoutHandler = async () => {
    try {
      await AsyncStorage.removeItem("authToken");
      await AsyncStorage.removeItem("userId");
      navigation.replace("Login");
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.mainContent}>
        <Text style={[styles.navTitle, {marginHorizontal: showArrow ? 0 : 8}]}>{title}</Text>
        {showArrow && (
          <ArrowBack width={22} height={22} />
        )}
      </View>
      {showLogoutIcon && (
        <TouchableOpacity onPress={logoutHandler}>
          <Logout width={24} height={24} color={Colors.white} />
        </TouchableOpacity>
      )}
    </View>
  )
}

interface Styles {
  container: ViewStyle,
  navTitle: TextStyle,
  mainContent: ViewStyle,
}

const styles = StyleSheet.create<Styles>({
  container: {
    height: 100,
    flexDirection: isRTL() ? 'row-reverse' : 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.primaryColor,
    paddingHorizontal: 8,
    borderBottomRightRadius: 8,
    borderBottomLeftRadius: 8,
    paddingTop: 42,
  },
  navTitle: {
    color: Colors.white,
    fontSize: 18,
    fontFamily: isRTL() ? fontsAR.medium : fontsEN.medium,
  },
  mainContent: {
    flexDirection: isRTL() ? 'row' : 'row-reverse',
    alignItems: 'center',
    gap: 4,
  },
});
