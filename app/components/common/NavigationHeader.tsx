import React from 'react'
import { Pressable, Text, TouchableOpacity, View } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { isRTL } from '../../assets/translation/resources';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '../../AppNavigation';
import { fonts } from '../../../src/theme/fonts';
import { useTheme } from '../../../src/theme/useTheme';
import ArrowBack from '../../assets/svgs/arrow-right.svg';
import Logout from '../../assets/svgs/log-out.svg';

type NavigationHeaderProps = {
  title: string;
  showArrow?: boolean;
  showLogoutIcon?: boolean;
};

const arrowStyle = { transform: [{ rotate: isRTL() ? '0deg' : '180deg' }] };

export const NavigationHeader = ({ title, showArrow, showLogoutIcon }: NavigationHeaderProps) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { getThemeColor } = useTheme();

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
    <View className="h-25 flex-row justify-between items-center bg-primaryColor px-2 rounded-b-lg pt-10.5">
      <View className="flex-row-reverse items-center gap-1">
        <Text className={`text-white text-[18px] ${fonts.medium} ${showArrow ? 'mx-0.5' : 'mx-2'}`}>{title}</Text>
        {showArrow && (
          <Pressable onPress={goBackHandler}>
            <ArrowBack color={getThemeColor('white')} style={arrowStyle} />
          </Pressable>
        )}
      </View>
      {showLogoutIcon && (
        <TouchableOpacity onPress={logoutHandler}>
          <Logout width={24} height={24} color={getThemeColor('white')} />
        </TouchableOpacity>
      )}
    </View>
  )
}
