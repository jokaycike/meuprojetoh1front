import { SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { imageMap } from "../../data/imageMap";
import charactersJson from '../../data/characters.json';

type RootStackParamList = {
  Characters: undefined;
  Game: {
    selectedCharacter: {
      id: string;
      name: string;
      image: any;
      description: string;
    }
  };
  Confirmation: {
    selectedGame: {
      id: string;
      name: string;
      image: any;
      description: string;
    }
  }
}

type CharactersScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Characters'>;

interface CharactersProps {
  navigation: CharactersScreenNavigationProp;
}

interface Characters {
  id: number;
  name: string;
  image: any; // Mudado de string para any para aceitar require()
  description: string;
}

export default function Characters({ navigation }: CharactersProps) {
  const [characters, setCharacters] = useState<Characters[]>([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Move fetchCharacters to component scope so it can be used elsewhere
  const fetchCharacters = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://meuprojetoh1service-mlb1.vercel.app/characters');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      // CORREÇÃO: Aplicar o mesmo mapeamento que funciona em Game
      const mappedCharacters = data.map((character: any) => ({
        ...character,
        id: typeof character.id === 'string' ? parseInt(character.id) : character.id,
        image: imageMap[character.image?.split('/').pop() || ''] || require("../../../assets/default.png"),
      }));
      
      setCharacters(mappedCharacters);
    } catch (error) {
      console.error('Erro ao busar personagens:', error);
      Alert.alert(
        'Erro',
        'Não foi possível carregar os personagens. Verifique sua conexão com a internet.',
        [
          {
            text: 'Tentar Novamente',
            onPress: fetchCharacters,
          },
          {
            text: 'Cancelar',
            style: 'cancel',
          },
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCharacters();
  }, []);

  const animateCardFlip = (direction: 'left' | 'right', newIndex: number) => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    
    // Determina a direção da rotação
    const rotationDirection = direction === 'left' ? -1 : 1;
    
    // Primeira parte da animação: gira para 90 graus e diminui escala
    Animated.parallel([
      Animated.timing(rotateAnim, {
        toValue: rotationDirection * 90,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Muda o personagem no meio da animação
      setCurrentIndex(newIndex);
      
      // Segunda parte da animação: volta para 0 graus e escala normal
      Animated.parallel([
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setIsAnimating(false);
      });
    });
  };

  const scrollToIndex = (index: number) => {
    if (isAnimating || characters.length === 0) return;
    
    let newIndex = index;
    let direction: 'left' | 'right' = 'right';
    
    // Garante rotação cíclica da lista
    if (newIndex < 0) {
      newIndex = characters.length - 1; // Vai para o último item
      direction = 'left';
    } else if (newIndex >= characters.length) {
      newIndex = 0; // Vai para o primeiro item
      direction = 'right';
    } else {
      // Determina direção baseada no índice
      direction = newIndex > currentIndex ? 'right' : 'left';
    }
    
    animateCardFlip(direction, newIndex);
  };

  const handleSelectCharacter = () => {
    if (isAnimating || characters.length === 0) return;
    
    navigation.navigate('Game', {
      selectedCharacter: {
        id: characters[currentIndex].id.toString(),
        name: characters[currentIndex].name,
        image: characters[currentIndex].image, // Agora já é um require()
        description: characters[currentIndex].description || "Descrição do personagem"
      }
    });
  };

  // Interpolação para a rotação
  const rotateY = rotateAnim.interpolate({
    inputRange: [-90, 0, 90],
    outputRange: ['-90deg', '0deg', '90deg'],
  });

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#035968" />
          <Text style={styles.loadingText}>Carregando personagens...</Text>
        </View>
      </SafeAreaView>
    );
  }

   // Tela de erro se não houver personagens
  if (characters.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={60} color="#035968" />
          <Text style={styles.errorText}>Nenhum personagem encontrado</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchCharacters}>
            <Text style={styles.retryButtonText}>Tentar Novamente</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
     <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Escolha seu Personagem</Text>
      
      <View style={styles.contentContainer}>
        
        <View style={styles.characterContainer}>
          <View style={styles.navigationRow}>
            <TouchableOpacity
              onPress={() => scrollToIndex(currentIndex - 1)}
              style={[styles.arrowButton, isAnimating && styles.disabledButton]}
              disabled={isAnimating}
            >
              <MaterialIcons name="chevron-left" size={22} color="#035968" />
            </TouchableOpacity>

            <Animated.View 
              style={[
                styles.imageContainer,
                {
                  transform: [
                    { rotateY: rotateY },
                    { scale: scaleAnim }
                  ]
                }
              ]}
            >
              {/* CORREÇÃO: Agora usa source direto ao invés de { uri: } */}
              <Image 
                source={characters[currentIndex].image}
                style={styles.characterImage} 
                onError={(error) => {
                  console.warn('Erro ao carregar imagem:', error.nativeEvent.error);
                }}
              />
            </Animated.View>

            <TouchableOpacity
              onPress={() => scrollToIndex(currentIndex + 1)}
              style={[styles.arrowButton, isAnimating && styles.disabledButton]}
              disabled={isAnimating}
            >
                <MaterialIcons name="chevron-right" size={22} color="#035968" />
            </TouchableOpacity>
          </View>

          <Text style={styles.characterName}>{characters[currentIndex].name}</Text>

          <View style={styles.descriptionContainer}>
            <Text style={styles.characterDescription}>
              {characters[currentIndex].description || "Descrição do personagem"}
            </Text>
          </View>

          <TouchableOpacity 
            style={[styles.readyButton, isAnimating && styles.disabledButton]}
            onPress={handleSelectCharacter}
            disabled={isAnimating}
          >
            <Text style={styles.readyButtonText}>Pronto</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#035968',
    textAlign: 'center',
    marginTop: 33,
    marginBottom: 30,
  },
  characterContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  navigationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  imageContainer: {
    width: 130,
    height: 130,
    borderRadius: 90,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#035968',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 8,
  },
  characterImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  arrowButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  disabledButton: {
    opacity: 1,
  },
  characterName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#035968',
    marginTop: 0,
    marginBottom: 10,
  },
  descriptionContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  characterDescription: {
    fontSize: 17,
    color: '#444',
    textAlign: 'justify',
    lineHeight: 24,
  },
  readyButton: {
    backgroundColor: '#035968',
    width: '90%',
    paddingVertical: 16,
    borderRadius: 16,
    marginTop: 'auto',
    marginBottom: 70,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  readyButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  // Estilos para loading
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 18,
    color: '#035968',
    fontWeight: '500',
  },
  // Estilos para erro
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    marginTop: 16,
    marginBottom: 24,
    fontSize: 18,
    color: '#035968',
    fontWeight: '500',
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#035968',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});