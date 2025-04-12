import React from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import Modal from "react-native-modal";

import { Colors } from "../../constants/Styles";
import Button from "../UI/Button";

const ConfirmModal = (props) => {
  return (
    <Modal
      isVisible={props.showModal}
      useNativeDriver={true}
      backdropOpacity={0.3}
      backdropTransitionInTiming={250}
      backdropTransitionOutTiming={200}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      animationInTiming={400}
      animationOutTiming={350}
      style={styles.modal}
      onRequestClose={props.closeModal}
      onBackdropPress={props.closeModal}
    >
      <View style={styles.modalView}>
        <View style={styles.modalContent}>
          <View style={styles.centeredContent}>
            <Image
              source={require("../../assets/icons/exclamation.png")}
              style={styles.exclamationIcon}
            />
            {props.title && (
              <View style={styles.content}>
                <Text style={styles.textTitleStyle}>
                  {props.title}
                </Text>
              </View>
            )}
            <View style={styles.buttons}>
              <Button
                btnStyle={styles.cancelBtnStyle}
                onPress={props.closeModal}
              >Cancel</Button>
              <Button
                btnStyle={styles.confirmBtnStyle}
                textStyle={styles.cancelTextStyle}
                onPress={props.confirm}
              >Confirm</Button>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
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

export default ConfirmModal;
