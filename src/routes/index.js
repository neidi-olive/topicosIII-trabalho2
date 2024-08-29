import { createNativeStackNavigator } from '@react-navigation/native-stack'

import Home from '../pages/Home';
import AddRecord from '../pages/AddRecord'
import Auth from '../components/Auth';


const Stack = createNativeStackNavigator();

export default function Routes() {

  
  return (

      <Stack.Navigator initialRouteName="Auth">
        
        <Stack.Screen 
          name="Auth"
          component={Auth}
          options={{ headerShown: false }}
        />

        <Stack.Screen 
          name="Home"
          component={Home}
          options={{ headerShown: false }}
        />

        <Stack.Screen 
          name="AddRecord"
          component={AddRecord}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>

  )
}
