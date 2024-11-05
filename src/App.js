import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native'; 
import NfcManager from 'react-native-nfc-manager';
import ScanNFC from './ScanNFC';
import AndroidPrompt from './AndroidPrompt';

function App(props) {
    const [hasNfc, setHasNfc] = React.useState(null);  
    const promptRef = React.useRef(null);

    React.useEffect(() => {
        async function checkNfc() {
          const supported = await NfcManager.isSupported();
          if (supported) {
            await NfcManager.start();
          }
          setHasNfc(supported);
        }
      
        checkNfc();
      }, []);
      

    if(hasNfc === null) {
        return null;
    }else if(!hasNfc) {
        return (
            <View style={styles.wrapper}>
                <Text>No NFC on your device</Text>
                <TouchableOpacity 
                onPress={() => {promptRef.current.setVisible(true)}}>
                    <Text>OK</Text>
                </TouchableOpacity>
                <AndroidPrompt ref={promptRef}/>
            </View>
        );
    }

    return ( <ScanNFC />
        
    );

}  

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default App;