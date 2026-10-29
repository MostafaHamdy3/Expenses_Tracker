import React, { forwardRef, useCallback, useImperativeHandle, useRef } from 'react'
import { StyleSheet, Text, TextStyle, TouchableOpacity, ViewStyle } from 'react-native'
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';

import i18n from '../../assets/translation/config';
import { isRTL } from '../../assets/translation/resources';
import { Colors } from '../../constants/Styles';
import { fontsAR, fontsEN } from '../../constants/config';
import { LanguagePreference, languageNames } from '../../utility/language';
import Check from '../../assets/svgs/check.svg';

interface LanguagePickerProps {
  selected: LanguagePreference;
  onSelect: (language: LanguagePreference) => void;
}

export type LanguagePickerHandle = {
  present: () => void;
  dismiss: () => void;
};

const options: { value: LanguagePreference, label: () => string }[] = [
  { value: "system", label: () => i18n.t("deviceLanguage") },
  { value: "ar", label: () => languageNames.ar },
  { value: "en", label: () => languageNames.en },
];

const LanguagePicker = forwardRef<LanguagePickerHandle, LanguagePickerProps>(({ selected, onSelect }, ref) => {
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  useImperativeHandle(ref, () => ({
    present: () => bottomSheetRef.current?.present(),
    dismiss: () => bottomSheetRef.current?.dismiss(),
  }));

  const selectHandler = (language: LanguagePreference) => {
    bottomSheetRef.current?.dismiss();
    onSelect(language);
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
    >
      <BottomSheetView style={styles.container}>
        <Text style={styles.title}>{i18n.t("chooseLanguage")}</Text>
        {options.map(({ value, label }) => (
          <TouchableOpacity
            key={value}
            style={[styles.option, value === selected && styles.selectedOption]}
            onPress={() => selectHandler(value)}
            activeOpacity={0.7}
          >
            <Text style={styles.optionText}>{label()}</Text>
            {value === selected && <Check width={20} height={20} color={Colors.primaryColor} />}
          </TouchableOpacity>
        ))}
      </BottomSheetView>
    </BottomSheetModal>
  );
});

interface Styles {
  container: ViewStyle;
  title: TextStyle;
  option: ViewStyle;
  selectedOption: ViewStyle;
  optionText: TextStyle;
}

const styles = StyleSheet.create<Styles>({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    gap: 8,
  },
  title: {
    textAlign: 'center',
    fontSize: 20,
    fontFamily: isRTL() ? fontsAR.medium : fontsEN.medium,
    marginBottom: 8,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: Colors.borderColor,
    borderRadius: 12,
  },
  selectedOption: {
    borderColor: Colors.primaryColor,
  },
  optionText: {
    fontSize: 16,
    color: Colors.mainColor,
    fontFamily: isRTL() ? fontsAR.medium : fontsEN.medium,
  },
});

export default LanguagePicker;
