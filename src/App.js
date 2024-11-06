import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import NfcManager, { NfcTech } from 'react-native-nfc-manager';
import { Linking } from 'react-native';

const App = () => {
  const [isModalVisible, setIsModalVisible] = useState(false); // State điều khiển việc hiển thị modal

  useEffect(() => {
    NfcManager.start();
    return () => {
      NfcManager.stop();
      NfcManager.setEventListenerOff();
    };
  }, []);

  const readNdef = async () => {
    try {
      await NfcManager.requestTechnology(NfcTech.Ndef);
      const tag = await NfcManager.getTag();
      console.log('Tag Scan Info', tag);

      if (tag.ndefMessage) {
        const ndefRecords = tag.ndefMessage;
        ndefRecords.forEach((record) => {
          const payload = record.payload;
          console.log('Payload:', payload);
          const text = payload.slice(1).map(byte => String.fromCharCode(byte)).join('');
          console.log('NDEF Record Text:', text);
          Linking.openURL(`https://${text}`).catch(err => console.error('Failed to open URL:', err));
        });
      }
    } catch (ex) {
      console.warn(ex);
    } finally {
      NfcManager.setEventListenerOff();
    }
  };

  const showModal = () => {
    setIsModalVisible(true); // Hiển thị modal khi nhấn "Start"
  };

  const closeModal = () => {
    setIsModalVisible(false); // Đóng modal khi nhấn "Esc"
  };

  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>NFC register tag demo</Text>

      {/* Modal thông báo "Scan your card" */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={closeModal} // Đảm bảo đóng modal khi nhấn ngoài modal
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Scan your card</Text>
            <TouchableOpacity onPress={closeModal} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>Esc</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Nút Start để hiển thị modal */}
      <TouchableOpacity style={styles.btn} onPress={() => { showModal(); readNdef(); }}>
        <Text>START</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  btn: {
    margin: 15,
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#ccc',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    color: '#333',
    marginBottom: 20,
  },
  closeBtn: {
    padding: 10,
    backgroundColor: '#f44336',
    borderRadius: 8,
  },
  closeBtnText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default App;
