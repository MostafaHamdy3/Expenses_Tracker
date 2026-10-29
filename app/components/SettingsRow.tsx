import React from 'react'
import { Text, TouchableOpacity } from 'react-native'
import { SvgProps } from 'react-native-svg'

import { isRTL } from '../assets/translation/resources'
import { cn } from '../../src/utils/cn'
import { fonts } from '../../src/theme/fonts'
import { useTheme } from '../../src/theme/useTheme'
import ChevronRight from '../assets/svgs/chevron-right.svg'

type SettingsRowProps = {
  Icon: React.FC<SvgProps>;
  label: string;
  value?: string;
  valueStyle?: string;
  destructive?: boolean;
  onPress?: () => void;
};

const chevronStyle = { transform: [{ rotate: isRTL() ? '180deg' : '0deg' }] };

export const SettingsRow = ({ Icon, label, value, valueStyle, destructive, onPress }: SettingsRowProps) => {
  const { getThemeColor } = useTheme();

  return (
    <TouchableOpacity
      className="flex-row items-center gap-3 py-3.5 px-4"
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={0.7}
    >
      <Icon width={22} height={22} color={getThemeColor(destructive ? 'error500' : 'mainColor')} />
      <Text className={`flex-1 text-[16px] ${fonts.medium} ${destructive ? 'text-error500' : 'text-mainColor'}`}>{label}</Text>
      {!!value && (
        <Text
          className={cn(`max-w-[50%] text-[15px] text-placeholderColor ${fonts.regular}`, valueStyle)}
          numberOfLines={1}
        >
          {value}
        </Text>
      )}
      {onPress && (
        <ChevronRight
          width={18}
          height={18}
          color={getThemeColor('placeholderColor')}
          style={chevronStyle}
        />
      )}
    </TouchableOpacity>
  )
}
