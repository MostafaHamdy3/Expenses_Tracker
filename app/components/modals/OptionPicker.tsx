import React, { forwardRef, useCallback, useImperativeHandle, useRef } from 'react'
import { Text, TouchableOpacity } from 'react-native'
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { withUniwind } from 'uniwind';

import { cn } from '../../../src/utils/cn';
import { fonts } from '../../../src/theme/fonts';
import { useTheme } from '../../../src/theme/useTheme';
import Check from '../../assets/svgs/check.svg';

export type PickerOption<T extends string> = { value: T, label: () => string };

type OptionPickerProps<T extends string> = {
  title: string;
  options: PickerOption<T>[];
  selected: T;
  onSelect: (value: T) => void;
};

const StyledBottomSheetView = withUniwind(BottomSheetView);

export type OptionPickerHandle = {
  present: () => void;
  dismiss: () => void;
};

const OptionPicker = forwardRef(<T extends string>(
  { title, options, selected, onSelect }: OptionPickerProps<T>,
  ref: React.ForwardedRef<OptionPickerHandle>,
) => {
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const { getThemeColor } = useTheme();

  useImperativeHandle(ref, () => ({
    present: () => bottomSheetRef.current?.present(),
    dismiss: () => bottomSheetRef.current?.dismiss(),
  }));

  const selectHandler = (value: T) => {
    bottomSheetRef.current?.dismiss();
    onSelect(value);
  };

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    []
  );

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      backdropComponent={renderBackdrop}
      enablePanDownToClose={true}
      backgroundStyle={{ backgroundColor: getThemeColor("bgContainer") }}
      handleIndicatorStyle={{ backgroundColor: getThemeColor("placeholderColor") }}
    >
      <StyledBottomSheetView className="px-5 pb-8 gap-2">
        <Text className={`text-center text-[20px] text-mainColor ${fonts.medium} mb-2`}>{title}</Text>
        {options.map(({ value, label }) => (
          <TouchableOpacity
            key={value}
            className={cn(
              "flex-row justify-between items-center py-3.5 px-4 border border-borderColor rounded-xl",
              value === selected && "border-primaryColor",
            )}
            onPress={() => selectHandler(value)}
            activeOpacity={0.7}
          >
            <Text className={`text-[16px] text-mainColor ${fonts.medium}`}>{label()}</Text>
            {value === selected && <Check width={20} height={20} color={getThemeColor("primaryColor")} />}
          </TouchableOpacity>
        ))}
      </StyledBottomSheetView>
    </BottomSheetModal>
  );
}) as <T extends string>(
  props: OptionPickerProps<T> & { ref?: React.Ref<OptionPickerHandle> },
) => React.ReactElement;

export default OptionPicker;
