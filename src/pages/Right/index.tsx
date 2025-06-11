import { RouteProp } from "@react-navigation/native";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type RootStackParamList = {
  Home: undefined;
  Right: {
    selectedCharacter: {
      id: string;
      name: string;
      image: any;
      description: string;
    };
    playerCharacter: {
      id: string;
      name: string;
      image: any;
      description: string;
    }
    opponentCharacter: {
      id: string;
      name: string;
      image: any;
      description: string;
    };
  };
};

type RightScreenRouteProp = RouteProp<RootStackParamList, 'Right'>;
type RightScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Right'>;

interface RightProps {
  route: RightScreenRouteProp;
  navigation: RightScreenNavigationProp;
}

export default function Right({ route, navigation }: RightProps) {
  // Verificando se selectedCharacter está corretamente recebido
  const { selectedCharacter, playerCharacter, opponentCharacter } = route.params || {};

  return (
    <View style={styles.container}>
      <View style={styles.resultCard}>
        <Text style={styles.mainTitle}>Parabéns! Você Acertou!</Text>
        
        {/* Seção do personagem que você escolheu para te representar */}
        <View style={styles.characterSection}>
          <Text style={styles.sectionTitle}>Seu Personagem</Text>
          <View>
            <FontAwesome5 name="crown" size={40} color="#ff6b35" />
          </View>
          <View style={styles.imageWrapper}>
            <Image
              source={playerCharacter.image}
              style={styles.characterImageMe}
            />
          </View>
          <Text style={styles.stutsGame}>Vencedor!</Text>
          <Text style={styles.characterName}>{playerCharacter.name}</Text>
        </View>

        <View style={styles.divider} />

        {/* Seção do personagem que você adivinhou corretamente */}
        <View style={styles.characterSection}>
          <Text style={styles.sectionTitle}>Personagem do Oponente</Text>
          <View style={styles.imageWrapper}>
            <Image
              source={opponentCharacter.image}
              style={styles.characterImage}
            />
          </View>
          <Text style={styles.characterName}>{opponentCharacter.name}</Text>
        </View>
        <TouchableOpacity 
          style={styles.buttonRefresh} 
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.buttonRefreshText}>Jogar de novo</Text>
          <MaterialIcons name="refresh" size={30} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
  },
  resultCard: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 30,
    width: '100%',
    maxWidth: 450,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  mainTitle: {
    fontSize: 23,
    fontWeight: 'bold',
    color: '#22a722',
    marginBottom: 5,
    textAlign: 'center',
  },
  characterSection: {
    alignItems: 'center',
    marginVertical: 15,
    width: '100%',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#035968',
    marginBottom: 15,
  },
  imageWrapper: {
    padding: 4,
    backgroundColor: '#f0f8ff',
    borderRadius: 60,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  characterImageMe: {
    width: 105,
    height: 105,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#fe6a3f",
  },
  characterImage: {
    width: 75,
    height: 75,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#035968",
  },
  characterName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#035968",
    textAlign: 'center',
    marginTop: 10,
  },
  stutsGame: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fe6a3f",
    textAlign: 'center',
    marginTop: 8,  
  },
  divider: {
    width: '80%',
    height: 2,
    backgroundColor: '#ddd',
    marginVertical: 10,
  },
  buttonRefresh: {
    backgroundColor: '#319b31',
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonRefreshText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
});
