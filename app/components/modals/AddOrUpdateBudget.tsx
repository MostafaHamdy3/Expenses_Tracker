import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { Image, Text } from 'react-native'
import { withUniwind } from 'uniwind';

import i18n from '../../assets/translation/config';

import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { fonts } from '../../../src/theme/fonts';
import { useTheme } from '../../../src/theme/useTheme';
import { useUserStore } from '../../store/UserStore';
import { Input } from '../common/Input';
import { Button } from '../common/Button';

type AddOrUpdateBudgetProps = {
  userBudget: number;
};

const StyledBottomSheetView = withUniwind(BottomSheetView);

export type AddOrUpdateBudgetHandle = {
  present: () => void;
  dismiss: () => void;
};

const AddOrUpdateBudget = forwardRef<AddOrUpdateBudgetHandle, AddOrUpdateBudgetProps>(({ userBudget }, ref) => {
  const { addOrUpdateUserBudget } = useUserStore();
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const { getThemeColor } = useTheme();

  const [loading, setLoading] = useState<boolean>(false);
  const [budget, setBudget] = useState<number>(0);

  useEffect(() => {
    setBudget(userBudget || 0);
  }, [userBudget]);

  const present = useCallback(() => {
    bottomSheetRef.current?.present();
  }, []);

  const dismiss = useCallback(() => {
    bottomSheetRef.current?.dismiss();
  }, []);

  useImperativeHandle(ref, () => ({
    present,
    dismiss
  }));

  const updateUserBudget = async () => {
    setLoading(true);
    await addOrUpdateUserBudget(budget);
    dismiss();
    setLoading(false);
  }

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
      index={0}
      snapPoints={['60%']}
      backdropComponent={renderBackdrop}
      enablePanDownToClose={true}
      backgroundStyle={{ backgroundColor: getThemeColor("bgContainer") }}
      handleIndicatorStyle={{ backgroundColor: getThemeColor("placeholderColor") }}
    >
      <StyledBottomSheetView className="p-5 flex-1">
        <Text className={`text-center text-[20px] text-mainColor ${fonts.medium} mb-4`}>{i18n.t("specifyYourBudget")}</Text>
        <Image
          source={require('../../assets/icons/specify_budget.jpg')}
          className="w-38.5 h-38.5 self-center rounded-3xl"
        />
        <Text className={`text-center text-[16px] ${fonts.regular} text-mainColor mt-6`}>{i18n.t("specifyDescription")}</Text>
        <Input
          textInputConfig={{
            placeholder: i18n.t("enterBudgetAmount"),
            keyboardType:"numeric",
            value: budget.toString(),
            onChangeText: (text) => setBudget(Number(text) || 0)
          }}
          isInvalid={false}
          customStyle="text-center text-[20px]"
        />
        <Button
          btnText={i18n.t("save")}
          onPress={updateUserBudget}
          textStyle="text-[18px]"
          customStyle="w-full h-13.5 self-center"
          isLoading={loading}
          disabled={loading}
        />
      </StyledBottomSheetView>
    </BottomSheetModal>
  );
});

export default AddOrUpdateBudget;