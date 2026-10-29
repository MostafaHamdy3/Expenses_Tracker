import React from "react";
import { View, Text, Image } from "react-native";
import Modal from 'react-native-modal';
import { useResolveClassNames } from "uniwind";

import i18n from "../../assets/translation/config";
import { fonts } from "../../../src/theme/fonts";
import { Button } from "../common/Button";

type ConfirmModalProps = {
  showModal: boolean;
  closeModal: () => void;
  confirm: () => void;
  isLoading: boolean;
  title: string;
};

export const ConfirmModal = ({
  showModal,
  closeModal,
  confirm,
  isLoading,
  title,
}: ConfirmModalProps) => {
  // react-native-modal only takes `style`, so resolve the classes into a style object.
  const modalStyle = useResolveClassNames("bg-overlay m-0 items-center justify-center");

  return (
    <Modal
      isVisible={showModal}
      useNativeDriver={true}
      backdropOpacity={0.3}
      backdropTransitionOutTiming={200}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      animationInTiming={400}
      animationOutTiming={350}
      style={modalStyle}
      onBackButtonPress={closeModal}
      onBackdropPress={closeModal}
    >
      <View className="w-[92%] justify-center items-center">
        <View className="w-full justify-center items-center rounded-[20px] bg-bgContainer overflow-hidden">
          <View className="flex-col justify-center items-center p-5">
            <Image
              source={require("../../assets/icons/exclamation.png")}
              resizeMode="contain"
              className="w-16 h-16 my-4"
            />
            {title && (
              <View className="items-center justify-center w-full">
                <Text className={`text-center text-[18px] ${fonts.medium} text-mainColor mx-6 leading-6.5`}>
                  {title}
                </Text>
              </View>
            )}
            <View className="w-full flex-col justify-center items-center mt-3.75">
              <Button
                btnText={i18n.t("cancel")}
                customStyle="w-75 bg-lightBg mb-0"
                onPress={closeModal}
              />
              <Button
                btnText={i18n.t("confirm")}
                customStyle="w-75 bg-bgContainer"
                textStyle="text-mainColor"
                onPress={confirm}
                isLoading={isLoading}
                loadingColorClassName="accent-darkBg"
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};
