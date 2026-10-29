import React from 'react'
import { StyleSheet, Text, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native'
import { SvgProps } from 'react-native-svg'

import { Colors } from '../constants/Styles'
import { isRTL } from '../assets/translation/resources'
import { fontsAR, fontsEN } from '../constants/config'
import ArrowRight from '../assets/svgs/arrow-right.svg'

interface SettingsRowProps {
  Icon: React.FC<SvgProps>;
  label: string;
  value?: string;
  valueStyle?: TextStyle;
  color?: string;
  onPress?: () => void;
}

export const SettingsRow = ({ Icon, label, value, valueStyle, color = Colors.mainColor, onPress }: SettingsRowProps) => {
  return (
    <TouchableOpacity
      style={styles.row}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={0.7}
    >
      <Icon width={22} height={22} color={color} />
      <Text style={[styles.label, { color }]}>{label}</Text>
      {!!value && <Text style={[styles.value, valueStyle]} numberOfLines={1}>{value}</Text>}
      {onPress && (
        <ArrowRight
          width={18}
          height={18}
          color={Colors.placeholderColor}
          style={{ transform: [{ rotate: isRTL() ? '180deg' : '0deg' }] }}
        />
      )}
    </TouchableOpacity>
  )
}

interface Styles {
  row: ViewStyle;
  label: TextStyle;
  value: TextStyle;
}

const styles = StyleSheet.create<Styles>({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  label: {
    flex: 1,
    fontSize: 16,
    fontFamily: isRTL() ? fontsAR.medium : fontsEN.medium,
  },
  value: {
    maxWidth: '50%',
    fontSize: 15,
    color: Colors.placeholderColor,
    fontFamily: isRTL() ? fontsAR.regular : fontsEN.regular,
  },
});
