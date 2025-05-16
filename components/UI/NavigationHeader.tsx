import React from 'react'
import { StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { IconButton } from './IconButton';
import { Colors } from '../../constants/Styles';
import { RootStackParamList } from '../../App';
import { isRTL } from '../../assets/translation/resources';
import { fontsAR, fontsEN } from '../../constants/config';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
          <IconButton
            icon="arrow-back"
            size={22} 
            color={Colors.white}
            onPress={goBackHandler}
          />
        )}
      </View>
      {showLogoutIcon && (
        <IconButton
          icon="log-out-outline"
          size={24}
          color={Colors.white}
          onPress={logoutHandler}
          style={{ marginRight: 8 }}
        />
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
    height: 95,
    flexDirection: isRTL() ? 'row-reverse' : 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.primaryColor,
    paddingTop: 42,
    paddingHorizontal: 8,
    borderBottomRightRadius: 8,
    borderBottomLeftRadius: 8,
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
