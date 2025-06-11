import { SafeAreaView } from "react-native-safe-area-context";
import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
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

const characters = charactersJson.map(character => ({
  ...character,
  image: imageMap[character.image.split('/').pop() || ''],
  description: (character as any).description || "No description available",
}))

export default function Characters({ navigation }: CharactersProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

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
    if (isAnimating) return;
    
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
    if (isAnimating) return;
    
    navigation.navigate('Game', {
      selectedCharacter: {
        id: characters[currentIndex].id.toString(),
        name: characters[currentIndex].name,
        image: characters[currentIndex].image,
        description: characters[currentIndex].description || "Descrição do personagem"
      }
    });
  };

  // Interpolação para a rotação
  const rotateY = rotateAnim.interpolate({
    inputRange: [-90, 0, 90],
    outputRange: ['-90deg', '0deg', '90deg'],
  });

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
              <Image 
                source={characters[currentIndex].image}
                style={styles.characterImage} 
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
});