import * as React from 'react';
import { TouchableOpacity, Linking } from 'react-native';
import { useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import styled from 'styled-components/native';

const DetailsWrapper = styled.View`
`;

const BadgeWrapper = styled.View`
  flex-direction: row;
  padding: 16px;
  background-color: transparent;
`;

const Badge = styled.View`
  margin: 4px;
  padding: 8px;
  border-radius: 8px;
  background-color: #262626;
  border: 1px solid black;
`;

const BadgeText = styled.Text`
  color: white;
`;

const InfoText = styled.Text`
  padding: 8px;
  fontSize: 24px;
  font-family: Calibri;
  color: #262626;
  font-weight: bold;
`;

const PokeImage = styled.Image`
  align-self: center;
`;

const InfoWrapper = styled.View`
  flex: 1;
  background-color: white;
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  align-items: center;
`;

const Stats = styled.View`
  flex-direction: row;
`;

const Line = styled.View`
  width: 80%;
  height: 1px;
  background-color: #262626;
`;

const Share = styled(TouchableOpacity)`
  padding: 12px;
  border-radius: 8px;
  text-align: center;
  font-family: Calibri;
  font-weight: Bold;
  color: ${({ shareColor }) => (shareColor === 'white' ? 'white' : 'black')};
  border: 1px solid ${({ shareColor }) =>
    shareColor === 'white' ? 'white' : 'black'};
`;

export default function Details() {
  const navigation = useNavigation();
  const route = useRoute();
  const { pokemonName, pokemonNumber } = route.params;
  const [type, setType] = useState(null);
  const [height, setHeight] = useState(null);
  const [weight, setWeight] = useState(null);
  const [hp, setHp] = useState(null);
  const [attack, setAttack] = useState(null);
  const [defense, setDefense] = useState(null);
  const [pkmImg, setPkmImg] = useState(null);
  const [pkmColor, setColor] = useState(null);

  const fetchPokemon = async () => {
    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${pokemonName}`
      );
      const data = await response.json();
      const pokemonData = {
        id: data.id,
        height: data.height,
        weight: data.weight,
        hp: data.stats[0].base_stat,
        attack: data.stats[1].base_stat,
        defense: data.stats[2].base_stat,
        type: data.types[0].type.name,
      };

      setHeight(pokemonData.height / 10);
      setWeight(pokemonData.weight / 10);
      setHp(pokemonData.hp);
      setAttack(pokemonData.attack);
      setDefense(pokemonData.defense);
      setType(pokemonData.type);

      setPkmImg(
        `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonData.id}.png`
      );

      const colorResponse = await fetch(
        `https://pokeapi.co/api/v2/pokemon-color/${pokemonName}/`
      );
      const speciesResponse = await fetch(data.species.url);
      const speciesData = await speciesResponse.json();
      const colorHex = speciesData.color.name;
      setColor(colorHex);
    } catch (error) {
      console.error('Error fetching Pokemon data:', error);
    }
  };

  const handleShare = () => {
    const message = `Wanna see ${pokemonName}'s stats? Check it out!
Type: ${type}
Height: ${height} m
Weight: ${weight} kg
HP: ${hp}
Attack: ${attack}
Defense: ${defense}
        `;

    Linking.openURL(
      `mailto:?subject=Pokemon Stats&body=${encodeURIComponent(message)}`
    );
  };

  React.useEffect(() => {
    fetchPokemon();
  }, []);

  React.useEffect(() => {
    navigation.setOptions({ title: pokemonName });
  }, [navigation, pokemonName]);

  return (
    <DetailsWrapper style={{ flex: 1, backgroundColor: pkmColor }}>
      <BadgeWrapper>
        <Badge>
          <BadgeText>{type}</BadgeText>
        </Badge>
      </BadgeWrapper>
      {pkmImg && (
        <PokeImage
          source={{ uri: pkmImg }}
          style={{ width: 300, height: 300 }}
        />
      )}
      <InfoWrapper>
        <Stats>
          <InfoText style={{ fontSize: 48, paddingTop: 20, paddingLeft: 25 }}>
            {height} m
          </InfoText>
          <InfoText style={{ fontSize: 48, paddingTop: 20, paddingLeft: 50 }}>
            {weight} kg
          </InfoText>
        </Stats>
        <Stats>
          <InfoText style={{ paddingLeft: 30 }}>HEIGHT</InfoText>
          <InfoText style={{ paddingLeft: 80 }}>WEIGHT</InfoText>
        </Stats>
        <Stats>
          <InfoText style={{ paddingTop: 30 }}>Base Stats </InfoText>
        </Stats>
        <Line />
        <Stats>
          <InfoText>HP -</InfoText>
          <InfoText>{hp}</InfoText>
        </Stats>
        <Stats>
          <InfoText>Attack -</InfoText>
          <InfoText>{attack}</InfoText>
        </Stats>
        <Stats>
          <InfoText>Defense -</InfoText>
          <InfoText>{defense}</InfoText>
        </Stats>
        <Share style={{ backgroundColor: pkmColor }} onPress={handleShare}>
          Compartilhar
        </Share>
      </InfoWrapper>
    </DetailsWrapper>
  );
}
