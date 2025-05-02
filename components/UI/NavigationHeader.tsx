import React from 'react'
import { StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { IconButton } from './IconButton';
import { Colors } from '../../constants/Styles';
import { RootStackParamList } from '../../App';
import { isRTL } from '../../assets/translation/resources';
import { fontsAR, fontsEN } from '../../constants/config';

interface NavigationHeaderProps {
  title: string;
}

export const NavigationHeader = ({ title }: NavigationHeaderProps) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const goBackHandler = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.navTitle}>{title}</Text>
      <IconButton
        icon="arrow-back"
        size={22} 
        color={Colors.white}
        onPress={goBackHandler}
      />
    </View>
  )
}

interface Styles {
  container: ViewStyle,
  navTitle: TextStyle,
}

const styles = StyleSheet.create<Styles>({
  container: {
    height: 95,
    flexDirection: 'row-reverse',
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: Colors.primaryColor,
    paddingTop: 42,
    paddingHorizontal: 8,
    gap: 4,
    borderBottomRightRadius: 8,
    borderBottomLeftRadius: 8,
  },
  navTitle: {
    color: Colors.white,
    fontSize: 18,
    fontFamily: isRTL() ? fontsAR.medium : fontsEN.medium,
  },
});
