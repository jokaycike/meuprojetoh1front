// src/pages/Home.js
import { StyleSheet, ScrollView, View, Image, Text, TouchableOpacity } from "react-native";
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
    Home: undefined;
    Rules: undefined;
    Characters: undefined;
};

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

interface HomeProps {
    navigation: HomeScreenNavigationProp;
}

export default function Home({ navigation }: HomeProps) {
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.logoContainer}>
                <Image
                    style={styles.logoImage}
                    source={require('../../../assets/Logo.png')}
                />
            </View>
            
            <View style={styles.buttonContainer}>
                <TouchableOpacity 
                    style={styles.startButton}
                    onPress={() => navigation.navigate('Characters')}
                >
                    <Text style={styles.startButtonText}>Começar</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                    style={styles.rulesButton}
                    onPress={() => navigation.navigate('Rules')}
                >
                    <Text style={styles.rulesButtonText}>Regras</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
},
logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
},
logoImage: {
    width: 300,
    height: 250,
    resizeMode: 'contain',
},
buttonContainer: {
    width: '80%',
    marginTop: 20,
},
startButton: {
    display: 'flex',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
},
startButtonText: {
    color: 'white',
    fontSize: 22,
    fontWeight: '600',
    backgroundColor: '#035968',
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
    display: 'flex',
    justifyContent: 'center',
    textAlign: 'center',
    width: 300,
    overflow: 'hidden',
},
rulesButton: {
    display: 'flex',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
},
rulesButtonText: {
    color: 'white',
    fontSize: 22,
    fontWeight: '600',
    backgroundColor: '#a1a1a1',
    padding: 16,
    borderRadius: 16,
    display: 'flex',
    justifyContent: 'center',
    textAlign: 'center',
    width: 300,
    overflow: 'hidden',
}
});