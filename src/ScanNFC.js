import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Platform} from 'react-native'; 
import NfcManager, {NfcEvents} from 'react-native-nfc-manager';
import AndroidPrompt from './AndroidPrompt';

function ScanNFC(props) {
    const [start, setStart] = React.useState(null);
    const [duration, setDuration] = React.useState(0);
    const androidPromptRef = React.useRef(null);

    React.useEffect(() => {
        let count = 1;
        NfcManager.setEventListener(NfcEvents.DiscoverTag, tag => {
            count--;

            if (Platform.OS === 'android') {
                androidPromptRef.current.setHintText(`${count}`);
            }else {NfcManager.setAlertMessageIOS(`${count}`);}
          
            if( count <= 0 ) {
                NfcManager.unregisterTagEvent().catch(() => 0);
                setDuration(new Date().getTime() - start.getTime());

                if (Platform.OS === 'android') {
                    androidPromptRef.current.setVisible(false);
                }
            }
        });

        return () => {
            NfcManager.setEventListener(NfcEvents.DiscoverTag, null);
        };
    }, [start]);

    async function scanTag(){
        await NfcManager.registerTagEvent();
        if (Platform.OS === 'android') {
            androidPromptRef.current.setVisible(true);
        }
        setStart(new Date());
        setDuration(0);
    }

    return (
        <View style={styles.wrapper}>
            <Text>NFC on progess</Text>
            {duration > 0 && <Text>Duration: {duration}ms</Text>}
            <TouchableOpacity styles={styles.btn} onPress={scanTag}>
                <Text>START</Text>
            </TouchableOpacity>
            <AndroidPrompt ref={androidPromptRef} />
        </View>
    );

}  

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    btn: {
        margin: 15,
        padding: 15,
        borderRadius: 8,
        backgroundColor: '#ccc',
    }
});

export default ScanNFC;