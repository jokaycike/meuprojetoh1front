import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './src/pages/Home';
import Rules from './src/pages/Rules';
import Characters from './src/pages/Characters';
import Game from './src/pages/Game';
import Confirmation from './src/pages/Confirmation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import Right from './src/pages/Right';
import Wrong from './src/pages/Wrong';

// Tipagem de parâmetros para cada tela
type RootStackParamList = {
  Home: undefined;
  Rules: undefined;
  Characters: undefined;
  Game: { selectedCharacter: { id: string; name: string; image: any; description: string } };
  Confirmation: { selectedGame: { id: string; name: string; image: any; description: string } };
  Right: undefined;
};

// Tipagem para `navigation` e `route` da tela "Game"
type GameScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Game'>;
type GameScreenRouteProp = RouteProp<RootStackParamList, 'Game'>;

// Tipagem para as propriedades do componente Game
type GameProps = {
  route: GameScreenRouteProp;
  navigation: GameScreenNavigationProp;
};

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Rules"
          component={Rules}
          options={{ title: 'Regras', headerShown: false }}
        />
        <Stack.Screen
          name="Characters"
          component={Characters}
          options={{ title: 'Characters', headerShown: false }}
        />
        <Stack.Screen
          name="Game"
          component={Game}  // Utilizamos o `component` diretamente com a tipagem correta
          options={{ title: 'Game', headerShown: false }}
        />
        <Stack.Screen
          name="Confirmation"
          component={Confirmation}
          options={{ title: 'Confirmation', headerShown: false }}
        />
        <Stack.Screen
          name="Right"
          component={Right}
          options={{ title: 'Right', headerShown: false }}
        />
        <Stack.Screen
          name="Wrong"
          component={Wrong}
          options={{ title: 'Wrong', headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
