import React, { useCallback, useEffect, useState } from 'react';
import { 
  View,
  StyleSheet,
  Text,
  ScrollView, 
} from 'react-native';

import { useFocusEffect, useNavigation } from '@react-navigation/native';

import { FlashList } from '@shopify/flash-list';

import Header from '../../components/Header';
import Balance from '../../components/Balance';
import Movements from '../../components/Movements';
import Actions from '../../components/Actions';

import colors from '../../theme/colors'
import { supabase } from '../../services/supabase';

import { useRoute } from '@react-navigation/native';

// const list = [
//   {
//     id: 1,
//     label: 'Boleto conta luz',
//     value: 235.89,
//     date: '17/01/2024',
//     type: 0, // despesas
//   },
//   {
//     id: 2,
//     label: 'Boleto conta água',
//     value: 137.55,
//     date: '20/01/2024',
//     type: 0, // despesas
//   },
//   {
//     id: 3,
//     label: 'Pix Cliente X',
//     value: 2500.00,
//     date: '22/01/2024',
//     type: 1, // receita / entrada
//   },
// ]

interface Account {
  id: number;
  label: string;
  value: number;
  date: string;
  type: number;
}

interface HomeProps {
  session: any; // Replace 'any' with the actual type if known
}

export default function Home() {

  const [session, setSession] = useState(null);

    useEffect(() => {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
      });

      supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
      });
    }, []);

  // const navigation = useNavigation();

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [sumOfDebits, setSumOfDebits] = useState(0);
  const [sumOfCredits, setSumOfCredits] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchAccountData = async () => {
    try {
      const { data, error } = await supabase
        .from('account_records')
        .select();

      return { data, error };
    } catch (error) {
      console.error("Unexpected error:", error);
      console.log("fetchAccountData ~ error:", error);
      return { data: [], error };
    }
  };

  const calculateSums = (accounts: Account[], recordType: number) => {
    if (accounts.length > 0) {
      const sum = accounts.reduce(
        (total, currentValue) => total + (recordType === currentValue.type ? currentValue.value : 0), 0
      );
      return parseFloat(sum.toFixed(2));
    }
    return 0;
  };

  const EmptyListMessage = () => {
    return (
      <Text>Não há accounts a serem exibidos!</Text>
    )
  };

  useEffect(() => {
    const updateData = async () => {
      const { data, error } = await fetchAccountData();
      if (error) {
        console.error('Error fetching data:', error);
        console.log('Error fetching data:', error);
        setAccounts([]);
      } else {
        setAccounts(data);
      }
    };
    setLoading(true);
    updateData();
    setLoading(false);
    console.log('updateData ~ accounts:', accounts);
  }, []);

  const updateSums = () => {
    setSumOfDebits(calculateSums(accounts, 0));
    console.log('updateSums ~ sumOfDebits:', sumOfDebits);
    setSumOfCredits(calculateSums(accounts, 1));
    console.log('updateSums ~ sumOfCredits:', sumOfCredits);
  };

  useFocusEffect(
    useCallback(() => {
      {!loading && updateSums()};
    }, [accounts])
  );

  if (!session) {
    return;
  }

  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Header name={session.user.email} />

        <Balance entradas={sumOfCredits} saldo={sumOfCredits - sumOfDebits} gastos={sumOfDebits} />

        <Actions />
      </View>

      <ScrollView
        style={styles.scrollArea}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Últimas movimentações</Text>
        <View style={styles.list}>
          {!loading && (
            <FlashList
              data={accounts}
              extraData={!loading && accounts}
              keyExtractor={ (item) => String(item.id) }
              showsVerticalScrollIndicator={false}
              renderItem={ ({ item }) => <Movements item={ item } />}
              ListEmptyComponent={EmptyListMessage}
              estimatedItemSize={200}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    width: '100%',
    backgroundColor: colors.opacity_white,
  },

  header: {
    marginTop: 0,
  },

  scrollArea: {
    marginTop: 80,
    color: colors.gray_400,
  },

  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.dark_purple,
    margin: 14,
    marginTop: 16, // TODO: continuar daqui - CRIAR .ENV
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 4,
    borderBottomColor: colors.light_purple,
  },

  list: {
    marginStart: 14,
    marginEnd: 14,
    // backgroundColor: colors.gray_200,
  },
})