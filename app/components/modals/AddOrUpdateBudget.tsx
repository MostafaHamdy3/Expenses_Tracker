import { forwardRef, useCallback, useImperativeHandle, useRef, useState } from 'react'
import { Text, View } from 'react-native'
import { withUniwind } from 'uniwind';
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetTextInput,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import i18n from '../../assets/translation/config';
import { cn } from '../../../src/utils/cn';
import { fonts } from '../../../src/theme/fonts';
import { useTheme } from '../../../src/theme/useTheme';
import { useSaveUserBudget } from '../../hooks/useUser';
import { Button } from '../common/Button';

type AddOrUpdateBudgetProps = {
  userBudget: number;
};

const StyledBottomSheetView = withUniwind(BottomSheetView);
const StyledBottomSheetTextInput = withUniwind(BottomSheetTextInput);

export type AddOrUpdateBudgetHandle = {
  present: () => void;
  dismiss: () => void;
};

const AddOrUpdateBudget = forwardRef<AddOrUpdateBudgetHandle, AddOrUpdateBudgetProps>(({ userBudget }, ref) => {
  const { mutateAsync: saveUserBudget, isPending: loading } = useSaveUserBudget();
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const { getThemeColor } = useTheme();
  const insets = useSafeAreaInsets();

  const [budget, setBudget] = useState<string>('');
  const [isValid, setIsValid] = useState<boolean>(true);

  const present = useCallback(() => {
    // Start from the saved budget each time the sheet opens.
    setBudget(userBudget > 0 ? String(userBudget) : '');
    setIsValid(true);
    bottomSheetRef.current?.present();
  }, [userBudget]);

  const dismiss = useCallback(() => {
    bottomSheetRef.current?.dismiss();
  }, []);

  useImperativeHandle(ref, () => ({ present, dismiss }), [present, dismiss]);

  const onChangeBudget = (value: string) => {
    // Accept "," or "٫" as decimal separator, keep a single dot and up to 2 decimals
    const normalized = value.replace(/[,٫]/g, '.').replace(/[^0-9.]/g, '');
    if (!/^\d*\.?\d{0,2}$/.test(normalized)) return;
    setBudget(normalized);
    !isValid && setIsValid(true);
  };

  const amount = parseFloat(budget);
  const isChanged = amount !== userBudget;

  const saveBudget = async () => {
    if (isNaN(amount) || amount <= 0) {
      setIsValid(false);
      return;
    }
    try {
      await saveUserBudget(amount);
      dismiss();
    } catch (err) {
      console.log("saveUserBudget ERROR ==>", err);
    }
  };

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
    ),
    []
  );

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      backdropComponent={renderBackdrop}
      enablePanDownToClose
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      android_keyboardInputMode="adjustResize"
      backgroundStyle={{ backgroundColor: getThemeColor('bgContainer') }}
      handleIndicatorStyle={{ backgroundColor: getThemeColor('placeholderColor') }}
    >
      <StyledBottomSheetView className="px-5 pt-2" style={{ paddingBottom: insets.bottom + 20 }}>
        <Text className={`text-center text-[20px] text-mainColor ${fonts.bold}`}>
          {i18n.t('specifyYourBudget')}
        </Text>
        <Text className={`text-center text-[15px] text-placeholderColor ${fonts.regular} mt-1.5`}>
          {i18n.t('specifyDescription')}
        </Text>

        <View
          className={cn(
            'flex-row items-center justify-center mt-6 py-5 rounded-2xl border bg-bgScreen',
            isValid ? 'border-borderColor' : 'border-error500',
          )}
          style={{ direction: 'ltr' }}
        >
          <Text className={cn('text-[28px] font-num-bold me-1', budget ? 'text-primaryColor' : 'text-placeholderColor')}>
            $
          </Text>
          <StyledBottomSheetTextInput
            value={budget}
            onChangeText={onChangeBudget}
            placeholder="0"
            placeholderTextColor={getThemeColor('placeholderColor')}
            selectionColor={getThemeColor('primaryColor')}
            keyboardType="decimal-pad"
            maxLength={9}
            autoFocus
            className="min-w-16 p-0 text-[40px] font-num-bold text-mainColor text-center"
            style={{ includeFontPadding: false }}
          />
        </View>
        {!isValid && (
          <Text className={`text-[13px] text-error500 ${fonts.medium} mt-2 mx-1`}>
            {i18n.t('budgetError')}
          </Text>
        )}

        <Button
          btnText={i18n.t('save')}
          onPress={saveBudget}
          textStyle={`text-[16px] ${fonts.bold}`}
          customStyle={cn('w-full h-13 m-0 mt-5 rounded-2xl', !isChanged && 'opacity-50')}
          isLoading={loading}
          disabled={loading || !isChanged}
        />
      </StyledBottomSheetView>
    </BottomSheetModal>
  );
});

export default AddOrUpdateBudget;
