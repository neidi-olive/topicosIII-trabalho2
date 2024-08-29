// import 'react-native-url-polyfill/auto'

import React, { useState, useEffect, useContext } from "react";

import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { supabase } from "./src/services/supabase";
import { NavigationContainer } from "@react-navigation/native";
import Routes from "./src/routes";

const Stack = createNativeStackNavigator();

export default function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  
  return (
      <NavigationContainer>

        <Routes />
        
      </NavigationContainer>
  );
}
