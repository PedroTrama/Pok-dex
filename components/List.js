import React, { useState, useEffect, useLayoutEffect } from 'react';
import {
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Wrapper from './Wrapper';
import styled from 'styled-components/native';

const SearchContainer = styled(View)`
`;

const SearchInput = styled(TextInput)`
  height: 40px;
  border: 1px solid #ed6b6b;
  padding: 8px;
  border-radius: 20px;
  color: 262626;
`;

const ItemContainer = styled(TouchableOpacity)`
  border-bottom-width: 1px;
  border-color: #ed6b6b;
  padding: 8px;
`;

const NameText = styled(Text)`
  padding: 8px;
  font-size: 18px;
  font-family: Calibri;
  color: #262626;
  text-align: center;
`;

const List = () => {
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const navigation = useNavigation();

  const fetchPokemon = async () => {
    try {
      const response = await fetch(
        'https://pokeapi.co/api/v2/pokemon?limit=1292&offset=0'
      );
      const data = await response.json();
      const pokemonList = data.results.map((pokemon) => ({
        name: pokemon.name,
      }));

      setList(pokemonList);
      setLoading(false);
    } catch (error) {
      console.error('Error: ', error);
    }
  };

  const Item = ({ name }) => (
    <ItemContainer onPress={() => handleItemPress(name)}>
      <NameText>{name}</NameText>
    </ItemContainer>
  );

  const handleItemPress = (name) => {
    navigation.navigate('Details', { pokemonName: name });
  };

  useEffect(() => {
    fetchPokemon();
  }, []);

  useEffect(() => {
    const filteredList = list.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filteredList);
  }, [searchTerm, list]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'Pokédex',
      headerStyle: {
        backgroundColor: '#ed6b6b',
      },
      headerTitleStyle: {
        color: '#ffdf40',
        fontSize: 50,
        fontFamily: 'Calibri',
        fontWeight: 'bold',
        textAlign: 'center',
        textShadowColor: '#6177f2',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 10,
      },
    });
  }, [navigation]);

  return (
    <Wrapper>
      <SearchContainer>
        <SearchInput
          placeholder="search"
          value={searchTerm}
          onChangeText={(text) => setSearchTerm(text)}
        />
      </SearchContainer>
      {loading && <ActivityIndicator size={'large'} />}
      <FlatList
        data={filteredData}
        renderItem={({ item }) => <Item name={item.name} />}
        keyExtractor={(item) => item.name}
        showsVerticalScrollIndicator={false}
      />
    </Wrapper>
  );
};

export default List;
