"use client"

import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, Modal } from "react-native"
import { useState } from "react"
import { MaterialIcons } from "@expo/vector-icons"
import type { RouteProp } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { imageMap } from "../../data/imageMap"
import charactersJson from '../../data/characters.json'


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

type GameScreenRouteProp = RouteProp<RootStackParamList, "Game">
type GameScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "Game">

interface GameProps {
  route: GameScreenRouteProp
  navigation: GameScreenNavigationProp
}

export default function Game({ route, navigation }: GameProps) {
  const [opponentCharacter, setOpponentCharacter] = useState<null | number>(null)
  const [isChoosingOpponent, setIsChoosingOpponent] = useState(true)
  const [opponentConfirmed, setOpponentConfirmed] = useState(false)

  const { selectedCharacter } = route.params
  const [selectedCharacters, setSelectedCharacters] = useState<number[]>([])
  const [confirmationMode, setConfirmationMode] = useState(false)
  const [confirmedCharacters, setConfirmedCharacters] = useState<number[]>([])
  const [correctCharacters, setCorrectCharacters] = useState<number[]>([])
  const [clearMode, setClearMode] = useState(false)
  const [actionType, setActionType] = useState<"reject" | "accept" | null>(null)

  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")

  const [characterHidden, setCharacterHidden] = useState(true)
  const [isFlipping, setIsFlipping] = useState(false)

  
const characters = charactersJson.map(character => ({
  ...character,
  image: imageMap[character.image.split('/').pop() || ''],
}))


  // Função para mostrar alert customizado
  const showCustomAlert = (message: string) => {
    setAlertMessage(message)
    setShowAlert(true)
  }

  const handleCharacterPress = (characterId: number) => {
    if (isChoosingOpponent && !opponentConfirmed) {
      setOpponentCharacter(characterId)
      return
    }
    // Se estiver no modo de limpeza, permite limpar personagens confirmados como errados
    if (clearMode) {
      if (confirmedCharacters.includes(characterId)) {
        setConfirmedCharacters((prev) => prev.filter((id) => id !== characterId))
      }
      return
    }

    // Se estiver no modo de confirmação, não permite seleção
    if (confirmationMode) return

    // Se o personagem já foi confirmado (errado ou correto), não permite seleção
    if (confirmedCharacters.includes(characterId) || correctCharacters.includes(characterId)) return

    setSelectedCharacters((prev) => {
      if (prev.includes(characterId)) {
        return prev.filter((id) => id !== characterId)
      } else {
        return [...prev, characterId]
      }
    })
  }

  const handleRejectPress = () => {
    if (selectedCharacters.length === 0) return

    if (confirmationMode && actionType === "reject") {
      // Cancel confirmation mode
      setConfirmationMode(false)
      setActionType(null)
    } else {
      // Enter confirmation mode for reject
      setConfirmationMode(true)
      setActionType("reject")
    }
  }

  const handleAcceptPress = () => {
    // Verifica se não há personagens selecionados
    if (selectedCharacters.length === 0) return

    // Verifica se já foi usado o botão de aceitar antes
    if (correctCharacters.length > 0) return

    // Verifica se há mais de 1 personagem selecionado
    if (selectedCharacters.length > 1) {
      // Opcional: Mostrar alerta ou mensagem
      showCustomAlert("Você só pode marcar 1 personagem como correto!")
      return
    }

    if (confirmationMode && actionType === "accept") {
      // Confirma como correto (verde) - só 1 personagem, 1 vez
      setCorrectCharacters((prev) => [...prev, ...selectedCharacters])
      setSelectedCharacters([])
      setConfirmationMode(false)
      setActionType(null)
    } else {
      // Entra no modo de confirmação para aceitar
      setConfirmationMode(true)
      setActionType("accept")
    }
  }

  const handleClearPress = () => {
    setClearMode(!clearMode)
    // Se estava no modo de confirmação, sai dele
    if (confirmationMode) {
      setConfirmationMode(false)
      setActionType(null)
    }
  }

  const handleConfirmPress = () => {
    if (actionType === "reject") {
      // Confirma como errados (vermelho)
      setConfirmedCharacters((prev) => [...prev, ...selectedCharacters])
      setSelectedCharacters([])
      setConfirmationMode(false)
      setActionType(null)
    } else if (actionType === "accept") {
      // Confirma como corretos (verde)
      const correctId = selectedCharacters[0]
      setCorrectCharacters((prev) => [...prev, ...selectedCharacters])
      setSelectedCharacters([])
      setConfirmationMode(false)
      setActionType(null)

      const selectedGame = characters.find((char) => char.id === correctId)

      const actualOpponentCharacter = characters.find(
        (char) => char.id === opponentCharacter, // opponentCharacter é o ID que você armazenou
      )

      if (selectedGame && actualOpponentCharacter) {
        // Garanta que ambos foram encontrados
        navigation.navigate("Confirmation", {
          selectedGame: {
            id: selectedGame.id.toString(),
            name: selectedGame.name,
            image: selectedGame.image,
            description: "Descrição do personagem aqui", // Ajuste a descrição se tiver
          },
          selectedCharacter: selectedCharacter, // Seu personagem
          opponentCharacter: {
            // Passe o objeto completo do oponente
            id: actualOpponentCharacter.id.toString(),
            name: actualOpponentCharacter.name,
            image: actualOpponentCharacter.image,
            description: "Descrição do personagem aqui", // Ajuste a descrição se tiver
          },
        })
      }
    }
  }

  const getCharacterStyle = (characterId: number) => {
    //  Personagem oponente selecionado (azul)
    if (isChoosingOpponent && characterId === opponentCharacter) {
      return {
        ...styles.characterImage,
        borderWidth: 4,
        borderColor: "#007bff",
        backgroundColor: "#007bff",
        opacity: 0.8,
      }
    }
    // Personagens corretos (verde)
    if (correctCharacters.includes(characterId)) {
      return {
        ...styles.characterImage,
        borderWidth: 4,
        borderColor: "#41bd4b",
        backgroundColor: "#4CAF50",
        opacity: 0.7,
      }
    }

    // Personagens confirmados como errados (vermelho)
    if (confirmedCharacters.includes(characterId)) {
      // Se estiver no modo de limpeza, destaca os que podem ser limpos
      if (clearMode) {
        return {
          ...styles.characterImage,
          borderWidth: 4,
          borderColor: "#fe001b",
          backgroundColor: "#fe001b",
          opacity: 0.5,
          // Adiciona um efeito visual para indicar que pode ser clicado
        }
      }
      return {
        ...styles.characterImage,
        borderWidth: 4,
        borderColor: "#fe001b",
        backgroundColor: "#fe001b",
        opacity: 0.3,
      }
    }

    // Personagens selecionados (amarelo)
    if (selectedCharacters.includes(characterId)) {
      return {
        ...styles.characterImage,
        borderWidth: 4,
        borderColor: "#ffb300",
        backgroundColor: "#ffb300",
      }
    }

    return styles.characterImage
  }

  const getButtonText = () => {
    if (clearMode) return "Sair do modo limpeza"
    if (confirmationMode) {
      return actionType === "accept" ? "Confirmar como certo" : "Confirmar como errado"
    }
    return "Confirmar"
  }

  const CustomAlert = () => (
    <Modal animationType="fade" transparent={true} visible={showAlert} onRequestClose={() => setShowAlert(false)}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Ícone de aviso */}
          <View style={styles.alertIconContainer}>
            <MaterialIcons name="warning" size={50} color="#ff6b35" />
          </View>

          {/* Título */}
          <Text style={styles.alertTitle}>Atenção!</Text>

          {/* Mensagem */}
          <Text style={styles.alertMessage}>{alertMessage}</Text>

          {/* Botão OK */}
          <TouchableOpacity style={styles.alertButton} onPress={() => setShowAlert(false)}>
            <Text style={styles.alertButtonText}>Entendi</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )

  const toggleCharacterVisibility = () => {
    if (isFlipping) return

    setIsFlipping(true)

    // Animação rápida similar à tela de personagens
    setTimeout(() => {
      setCharacterHidden((prev) => !prev)
    }, 150) // Muda a imagem no meio da animação

    setTimeout(() => {
      setIsFlipping(false)
    }, 300) // Termina a animação
  }

  return (
    <View style={styles.container}>
      <View style={styles.contentHeader}>
        <Text style={styles.headerText}>{isChoosingOpponent ? "Oponente escolhe o personagem" : "Seu personagem"}</Text>
      </View>

      {!isChoosingOpponent && (
        <TouchableOpacity style={styles.selectedCharacterContainer} onPress={toggleCharacterVisibility}>
          <View style={[styles.selectedCharacterImageWrapper, isFlipping && styles.flippingAnimation]}>
            <Image
              source={characterHidden ? require("../../../assets/default.png") : selectedCharacter.image}
              style={styles.selectedCharacterImage}
            />
          </View>
          {!characterHidden && <Text style={styles.selectedCharacterName}>{selectedCharacter.name}</Text>}
        </TouchableOpacity>
      )}

      {clearMode && (
        <View style={styles.instructionContainer}>
          <MaterialIcons name="info" size={20} color="#035968" style={styles.infoIcon} />
          <Text style={styles.instructionText}>Clique nos personagens vermelhos para remover a marcação de erro</Text>
        </View>
      )}

      <ScrollView style={styles.scrollView}>
        <View style={isChoosingOpponent ? styles.characterGrid : styles.characterGridTwo}>
          {characters.map((character) => (
            <TouchableOpacity
              key={character.id}
              style={styles.characterItem}
              onPress={() => handleCharacterPress(character.id)}
              disabled={
                !clearMode &&
                !isChoosingOpponent &&
                (confirmedCharacters.includes(character.id) || correctCharacters.includes(character.id))
              }
            >
              <Image source={character.image} style={getCharacterStyle(character.id)} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {isChoosingOpponent && !opponentConfirmed && (
        <View style={styles.confirmationContainer}>
          <TouchableOpacity
            style={[styles.confirmButton, opponentCharacter === null && styles.disabledButton]}
            onPress={() => {
              if (opponentCharacter !== null) {
                setOpponentConfirmed(true)
                setIsChoosingOpponent(false)
              }
            }}
            disabled={opponentCharacter === null}
          >
            <Text style={styles.confirmButtonText}>Confirmar personagem</Text>
            <MaterialIcons name="check" size={24} color="white" />
          </TouchableOpacity>
        </View>
      )}

      {!isChoosingOpponent && !confirmationMode && (
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.rejectButton, selectedCharacters.length === 0 && styles.disabledButton]}
            onPress={handleRejectPress}
            disabled={selectedCharacters.length === 0}
          >
            <MaterialIcons name="close" size={30} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.clearButton, clearMode && styles.activeClearButton]}
            onPress={handleClearPress}
          >
            <MaterialIcons name="cleaning-services" size={30} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionButton,
              styles.acceptButton,
              (selectedCharacters.length === 0 || selectedCharacters.length > 1 || correctCharacters.length > 0) &&
                styles.disabledButton,
            ]}
            onPress={handleAcceptPress}
            disabled={selectedCharacters.length === 0 || selectedCharacters.length > 1 || correctCharacters.length > 0}
          >
            <MaterialIcons name="check" size={30} color="white" />
          </TouchableOpacity>
        </View>
      )}

      {!isChoosingOpponent && confirmationMode && (
        <View style={styles.confirmationContainer}>
          <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmPress}>
            <Text style={styles.confirmButtonText}>{getButtonText()}</Text>
            <MaterialIcons name="check" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.confirmButton, styles.cancelButton]}
            onPress={() => {
              setConfirmationMode(false)
              setActionType(null)
            }}
          >
            <Text style={styles.confirmButtonText}>Cancelar</Text>
            <MaterialIcons name="close" size={24} color="white" />
          </TouchableOpacity>
        </View>
      )}
      <CustomAlert />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  contentHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    marginBottom: 10,
    position: "relative",
  },
  backgroundBackButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#e0f2f4",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    left: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  headerText: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    color: "#035968",
  },
  selectedCharacterContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  selectedCharacterImageWrapper: {
    padding: 4,
    backgroundColor: "#e0f2f4",
    borderRadius: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedCharacterImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: "#035968",
  },
  selectedCharacterName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#035968",
    marginTop: 10,
  },
  instructionContainer: {
    backgroundColor: "#e0f2f4",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  infoIcon: {
    marginRight: 10,
  },
  instructionText: {
    flex: 1,
    color: "#444",
    fontSize: 14,
    lineHeight: 20,
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  characterGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingVertical: 10,
    marginVertical: 50,
  },
  characterGridTwo:{
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  characterItem: {
    width: "25%",
    aspectRatio: 1,
    padding: 5,
  },
  characterImage: {
    width: "100%",
    height: "100%",
    borderRadius: 100,
    borderWidth: 2,
    borderColor: "#ddd",
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 25,
  },
  actionButton: {
    width: 60,
    height: 60,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  rejectButton: {
    backgroundColor: "#e74c3c",
  },
  acceptButton: {
    backgroundColor: "#2ecc71",
  },
  clearButton: {
    backgroundColor: "#7f8c8d",
  },
  activeClearButton: {
    backgroundColor: "#3498db",
  },
  disabledButton: {
    backgroundColor: "#ccc",
    opacity: 0.5,
  },
  actionButtonText: {
    color: "white",
    fontSize: 30,
  },
  confirmationContainer: {
    marginVertical: 30,
    alignItems: "center",
  },
  confirmButton: {
    backgroundColor: "#06a5c1",
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
    width: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  cancelButton: {
    backgroundColor: "#e74c3c",
  },
  confirmButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 30,
    margin: 40,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
    minWidth: 280,
  },
  alertIconContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: "#ff6b35",
    borderRadius: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  alertTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#035968",
    marginBottom: 15,
    textAlign: "center",
  },
  alertMessage: {
    fontSize: 16,
    color: "#44",
    marginBottom: 25,
    textAlign: "center",
    lineHeight: 22,
  },
  alertButton: {
    backgroundColor: "#035968",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    minWidth: 120,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  alertButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  flippingAnimation: {
    transform: [{ rotateY: "90deg" }, { scale: 0.8 }],
  },
})
