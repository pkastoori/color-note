import { Button, FlatList, Modal, StyleSheet, View } from "react-native";
import { modalData } from "../../constants/colors";
import IconButton from "./IconButton";

const ItemModal = ({ modalVisible, modalHandler }) => {
  return (
    <Modal animationType="slide" visible={modalVisible} transparent={true}>
      <View style={styles.modalView}>
        <FlatList
          numColumns={3}
          data={modalData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <IconButton
              icon="square"
              color={item.color}
              size={80}
              onPress={() => modalHandler(item.color, item.colorLight)}
            />
          )}
        />
        <Button title="Close" color="gray" onPress={modalHandler} />
      </View>
    </Modal>
  );
};

export default ItemModal;

const styles = StyleSheet.create({
  modalView: {
    marginTop: 180,
    alignItems: "center",
    backgroundColor: "white",
    width: 350,
    alignSelf: "center",
    padding: 10,
  },
});
