import React from 'react';
import {View, Text, Modal, StyleSheet, Dimensions, TouchableOpacity} from 'react-native';

function AndroidPrompt(props, ref) {
const [visible, setVisible] = React.useState(false);
const [hintText, setHintText] = React.useState('');

React.useEffect(() => {
    if(ref) {
        ref.current = {
            setHintText,
            setVisible,
        };
    }
}, [ref]);

    return (
        <Modal visible={visible} transparent={true}>
            <View style={styles.content}>
                <View style={[styles.backdrop, StyleSheet.absoluteFill]} />

                <View style={styles.prompt}>
                    <Text style={styles.hint}>Scan your NFC</Text>

                    <TouchableOpacity
                    style={styles.btn}
                    onPress={() =>{
                        setVisible(false);
                        setHintText('');
                    }}>
                        <Text>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    content: {
        flex: 1,
    },
    backdrop: {
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    prompt: {
        position: 'absolute',
        bottom: 0,
        width: Dimensions.get('window').width,
        backgroundColor: 'white',
        paddingVertical: 60,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    hint: {
        fontSize: 24,
        marginBottom: 20,
    },
    btn: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 15,
    }
});

export default React.forwardRef(AndroidPrompt);