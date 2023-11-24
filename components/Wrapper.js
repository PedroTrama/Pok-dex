import styled from 'styled-components/native';
import { View } from 'react-native';
import Constants from 'expo-constants';

const Wrapper = styled(View)`
  flex: 1;
  justify-content: center;
  padding-top: ${Constants.statusBarHeight};
  background-color: #ffc9c9;
  padding: 8px;
`;

export default Wrapper;