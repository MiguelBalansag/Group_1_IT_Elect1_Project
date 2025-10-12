//I sud dri ag inyong magama nga login screen 
import React, { useState } from 'react';


const LoginScreen = () => {


    return (
      
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                
sudli ni goiss
            </View>
        </SafeAreaView>
    );
};

// --- STYLESHEET ---

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    container: {
        flex: 1,
        paddingHorizontal: 30,
        paddingTop: '20%', // Spacing from the top
    },

});

export default LoginScreen;