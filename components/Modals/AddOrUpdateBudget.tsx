import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { Image, StyleSheet, Text, TextInput } from 'react-native'

import { Button } from '../UI/Button';
import { useUserStore } from '../../store/user_store';
import i18n from '../../assets/translation/config';
import { Colors } from '../../constants/Styles';

import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { fontsAR, fontsEN } from '../../constants/config';
import { isRTL } from '../../assets/translation/resources';
import { Input } from '../UI/Input';

interface AddOrUpdateBudgetProps {
  userBudget: number;
}

export type AddOrUpdateBudgetHandle = {
  present: () => void;
  dismiss: () => void;
};

const AddOrUpdateBudget = forwardRef<AddOrUpdateBudgetHandle, AddOrUpdateBudgetProps>(({ userBudget }, ref) => {
  const { addOrUpdateUserBudget } = useUserStore();
  const bottomSheetRef = useRef<BottomSheetModal>(null);

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
    >
      <BottomSheetView style={styles.container}>
        <Text style={styles.title}>{i18n.t("specifyYourBudget")}</Text>
        <Image
          source={require('../../assets/icons/specify_budget.jpg')}
          style={styles.specifyBudgetImage}
        />
        <Text style={styles.desc}>{i18n.t("specifyDescription")}</Text>
        <Input
          textInputConfig={{
            placeholder: i18n.t("enterBudgetAmount"),
            keyboardType:"numeric",
            value: budget.toString(),
            onChangeText: (text) => setBudget(Number(text) || 0)
          }}
          isInvalid={false}
          customStyle={styles.input}
        />
        <Button
          btnText={i18n.t("save")}
          onPress={updateUserBudget}
          textStyle={styles.saveBtnText}
          btnStyle={styles.saveBtnStyle}
          isLoading={loading}
          disabled={loading}
        />
      </BottomSheetView>
    </BottomSheetModal>
  );
});

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  title: {
    textAlign: 'center',
    fontSize: 20,
    fontFamily: isRTL() ? fontsAR.medium : fontsEN.medium,
    marginBottom: 16,
  },
  specifyBudgetImage: {
    width: 154,
    height: 154,
    alignSelf: 'center',
    borderRadius: 24,
  },
  desc: {
    textAlign: 'center',
    fontSize: 16,
    fontFamily: isRTL() ? fontsAR.regular : fontsEN.regular,
    color: Colors.mainColor,
    marginTop: 24,
  },
  input: {
    textAlign: 'center',
    fontSize: 20,
  },
  saveBtnText: {
    fontSize: 18,
  },
  saveBtnStyle: {
    width: '100%',
    height: 54,
    alignSelf: 'center',
  },
});

export default AddOrUpdateBudget;