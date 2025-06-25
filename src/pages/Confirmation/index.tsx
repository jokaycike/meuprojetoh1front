"use client"

import { useEffect, useRef } from "react"
import { View, Text, Image, StyleSheet, ActivityIndicator, Animated, Dimensions } from "react-native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import type { RouteProp } from "@react-navigation/native"
import Svg, { Rect } from "react-native-svg"

const { width: screenWidth } = Dimensions.get("window")

type RootStackParamList = {
  Characters: undefined
  Game: {
    selectedCharacter: {
      id: string
      name: string
      image: any
      description: string
    }
  }
  Confirmation: {
    selectedGame: {
      id: string
      name: string
      image: any
      description: string
    }
    selectedCharacter: {
      id: string
      name: string
      image: any
      description: string
    }
    opponentCharacter: {
      id: string
      name: string
      image: any
      description: string
    }
  }
  Right: {
    selectedCharacter: {
      id: string
      name: string
      image: any
      description: string
    }
    playerCharacter: {
      id: string
      name: string
      image: any
      description: string
    }
    opponentCharacter: {
      id: string
      name: string
      image: any
      description: string
    }
  }
  Wrong: {
    selectedCharacter: {
      id: string
      name: string
      image: any
      description: string
    }
    playerCharacter: {
      id: string
      name: string
      image: any
      description: string
    }
    opponentCharacter: {
      id: string
      name: string
      image: any
      description: string
    }
  }
}

type ConfirmationScreenRouteProp = RouteProp<RootStackParamList, "Confirmation">
type ConfirmationScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "Confirmation">

type ConfirmationProps = {
  route: ConfirmationScreenRouteProp
  navigation: ConfirmationScreenNavigationProp
}

export default function Confirmation({ route, navigation }: ConfirmationProps) {
  const { selectedGame, selectedCharacter, opponentCharacter } = route.params

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (String(selectedGame.id) === String(opponentCharacter.id)) {
        navigation.replace("Right", {
          selectedCharacter: selectedGame,
          playerCharacter: selectedCharacter,
          opponentCharacter: opponentCharacter,
        })
      } else {
        navigation.replace("Wrong", {
          selectedCharacter: selectedGame,
          playerCharacter: selectedCharacter,
          opponentCharacter: opponentCharacter,
        })
      }
    }, 5000)

    return () => clearTimeout(timeout)
  }, [selectedGame, selectedCharacter, opponentCharacter, navigation])

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Você disse que o personagem do seu oponente era:</Text>
        <View style={styles.imageContainer}>
          <Image source={selectedGame.image} style={styles.characterImage} />
        </View>
        <Text style={styles.characterName}>{selectedGame.name}</Text>
        <View style={{ display: "flex", alignItems: "center", marginTop: 20 }}>
          <Text style={styles.characterQuestion}>Verificando se você acertou.. </Text>
        </View>
        <ActivityIndicator size="large" color="#035968" style={{ marginTop: 40 }} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8f9fa",
    padding: 20,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 20,
    paddingHorizontal: 30,
    paddingVertical: 40,
    alignItems: "center",
    width: screenWidth - 40,
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#035968",
    textAlign: "center",
    marginBottom: 30,
  },
  imageContainer: {
    padding: 8,
    backgroundColor: "#f0f8ff",
    borderRadius: 100,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  characterImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: "#035968",
  },
  characterName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#035968",
    marginTop: 20,
  },
  characterQuestion: {
    fontSize: 18,
    fontWeight: "500",
    color: "#676767",
    marginTop: 20,
  },
})
