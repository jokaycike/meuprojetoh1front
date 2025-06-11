import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from "react-native";
import type { StackNavigationProp } from '@react-navigation/stack';
import { MaterialIcons } from '@expo/vector-icons';


type RulesScreenProps = {
    navigation: StackNavigationProp<any>;
};

export default function Rules({ navigation }: RulesScreenProps) {
    
    const LineDivider = () => {
        return <View style={styles.divider} />;
    };


    return (
        <ScrollView  contentContainerStyle={styles.scrollContainer}>
            <Text style={styles.title}>Regras do Jogo</Text>
            
            <LineDivider/>
            <View style={styles.rulesContainer}>
                <View style={styles.ruleCard}>
                    <View style={styles.optionsRules}>
                        <View style={styles.iconContainer}>
                            <MaterialIcons name="gps-fixed" size={20} color="#ffff" />
                        </View>
                        <Text style={styles.ruleTitle}>
                            Objetivo do Jogo
                        </Text>
                    </View>
                    <Text style={styles.ruleText}>
                        Descobrir qual é o personagem secreto do seu oponente antes que ele descubra o seu.
                    </Text>
                </View>

                <View style={styles.ruleCard}>
                    <View style={styles.optionsRules}>
                        <View style={styles.iconContainer}>
                            <MaterialIcons name="safety-divider" size={26} color="#ffff" />
                        </View>
                        <Text style={styles.ruleTitle}>
                            Preparação
                        </Text>
                    </View>
                    <Text style={styles.ruleText}>
                        Cada jogador escolhe um personagem secreto que o outro deverá adivinhar.
                        Mantenha seu personagem em segredo!
                    </Text>
                </View>

                <View style={styles.ruleCard}>
                    <View style={styles.optionsRules}>
                        <View style={styles.iconContainer}>
                            <MaterialIcons name="question-mark" size={20} color="#ffff" />
                        </View>
                        <Text style={styles.ruleTitle}>
                            Como Jogar
                        </Text>
                    </View>
                    <Text style={styles.ruleText}>
                        Os jogadores se revezam fazendo perguntas criativas de “Sim ou Não” sobre o personagem do oponente.
                        Com base nas respostas, vá eliminando os personagens que não se encaixam.
                    </Text>
                </View>

                <View style={styles.ruleCard}>
                    <View style={styles.optionsRules}>
                        <View style={styles.iconContainer}>
                            <MaterialIcons name="gavel" size={22} color="#ffff" />
                        </View>
                        <Text style={styles.ruleTitle}>
                            Regras das Perguntas
                        </Text>
                    </View>
                    <Text style={styles.ruleText}>
                        Somente perguntas de “Sim ou Não” são permitidas.
                        Evite perguntas óbvias, como:
                        “Ele tem olhos azuis?”
                        “É uma menina?”
                        “Ele tem cabelo castanho?”
                        Em vez disso, seja criativo! Pense em perguntas que combinem características de forma mais estratégica.
                    </Text>
                </View>

                <View style={styles.ruleCard}>
                    <View style={styles.optionsRules}>
                        <View style={styles.iconContainer}>
                            <MaterialIcons name="extension-off" size={22} color="#ffff" />
                        </View>
                        <Text style={styles.ruleTitle}>
                            Eliminando Personagens
                        </Text>
                    </View>
                    <Text style={styles.ruleText}>
                        Para eliminar um personagem:
                        Clique no personagem.
                        Toque no botão “X”.
                        Confirme a eliminação.
                    </Text>
                </View>

                <View style={styles.ruleCard}>
                    <View style={styles.optionsRules}>
                        <View style={styles.iconContainer}>
                            <MaterialIcons name="military-tech" size={24} color="#ffff" />
                        </View>
                        <Text style={styles.ruleTitle}>
                            Adivinhando o Personagem
                        </Text>
                    </View>
                    <Text style={styles.ruleText}>
                        Quando achar que sabe quem é o personagem do oponente:
                        Clique no personagem.
                        Toque no botão “✔️”.
                        Confirme sua escolha.
                        Se acertar, vence o jogo!
                        Se errar, perde.
                    </Text>
                </View>
            </View>
            
            <TouchableOpacity 
                style={styles.backButton}
                onPress={() => navigation.goBack()}
            >
                <Text style={styles.backButtonText}>Voltar</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        paddingVertical: 60,
        backgroundColor: '#f8f9fa',
    },
    title: {
        fontSize: 28,
        paddingHorizontal: 22,
        fontWeight: 'bold',
        color: '#035968',
        textAlign: 'center',
        marginBottom: 10,
    },
    rulesContainer: {
        width: '100%',
        marginBottom: 30,
        paddingHorizontal: 22
    },
    ruleCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    optionsRules: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 14,
    },
    iconContainer: {
        backgroundColor: '#035968',
        width: 30,
        height: 30,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    ruleTitle: {
        fontSize: 18,
        lineHeight: 24,
        fontWeight: '600',
        color: '#035968',
    },
    ruleText: {
        fontSize: 16,
        lineHeight: 22,
        color: '#555',
        paddingLeft: 4,
    },
    backButton: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 40,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    backButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
        backgroundColor: '#035968',
        padding: 14,
        borderRadius: 12,
        width: 200,
        textAlign: 'center',
    },
    divider: {
        height: 1.5,
        backgroundColor: '#dbdbdb',
        marginTop: 22,
        marginBottom:25,
    },

});