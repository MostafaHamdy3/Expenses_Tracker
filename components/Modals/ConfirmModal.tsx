import React from "react";
import { StyleSheet, View, Text, Image, ViewStyle, ImageStyle, TextStyle } from "react-native";
import Modal from 'react-native-modal';

import { Colors } from "../../constants/Styles";
import { Button } from "../UI/Button";

interface ConfirmModalProps {
  showModal: boolean;
  closeModal: () => void;
  confirm: () => void;
  isLoading: boolean;
  title: string;
}

export const ConfirmModal = ({
  showModal,
  closeModal,
  confirm,
  isLoading,
  title,
}: ConfirmModalProps) => {
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
      style={styles.modal}
      // onRequestClose={closeModal}
      onBackButtonPress={closeModal}
      onBackdropPress={closeModal}
    >
      <View style={styles.modalView}>
        <View style={styles.modalContent}>
          <View style={styles.centeredContent}>
            <Image
              source={require("../../assets/icons/exclamation.png")}
              style={styles.exclamationIcon}
            />
            {title && (
              <View style={styles.content}>
                <Text style={styles.textTitleStyle}>{title}</Text>
              </View>
            )}
            <View style={styles.buttons}>
              <Button
                btnText="Cancel"
                btnStyle={styles.cancelBtnStyle}
                onPress={closeModal}
              />
              <Button
                btnText="Confirm"
                btnStyle={styles.confirmBtnStyle}
                textStyle={styles.cancelTextStyle}
                onPress={confirm}
                isLoading={isLoading}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

interface Styles {
  modal: ViewStyle;
  modalView: ViewStyle;
  modalContent: ViewStyle;
  centeredContent: ViewStyle;
  exclamationIcon: ImageStyle;
  content: ViewStyle;
  textTitleStyle: TextStyle;
  buttons: ViewStyle;
  cancelBtnStyle: ViewStyle;
  cancelTextStyle: TextStyle;
  confirmBtnStyle: ViewStyle;
}

const styles = StyleSheet.create<Styles>({
  modal: {
    backgroundColor: "rgba(0,0,0,0.5)",
    margin: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  modalView: {
    width: "92%",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    backgroundColor: Colors.textColor1,
    overflow: "hidden",
  },
  centeredContent: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  exclamationIcon: {
    width: 64,
    height: 64,
    resizeMode: "contain",
    marginVertical: 16,
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  textTitleStyle: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
    color: 'black',
    marginHorizontal: 24,
    lineHeight: 24,
  },
  buttons: {
    width: "100%",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
  },
  confirmBtnStyle: {
    width: 300,
    backgroundColor: Colors.fieldBg,
  },
  cancelTextStyle: {
    color: Colors.gray700,
  },
  cancelBtnStyle: {
    width: 300,
    backgroundColor: Colors.lightBg,
    marginBottom: 0,
  },
});
