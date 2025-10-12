import React, { useState } from 'react';

const RegisterScreen = () => {
    

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>

                Sudli ni gois

            </View>
        </SafeAreaView>
    );
};

// --- STYLESHEET (Replicated from Login Screen) ---

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    container: {
        flex: 1,
        paddingHorizontal: 30,
        paddingTop: '20%',
    },
});

export default RegisterScreen;