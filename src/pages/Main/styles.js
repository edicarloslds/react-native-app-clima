import styled from 'styled-components/native';

export const Container = styled.SafeAreaView`
    flex: 1
    justifyContent: center
    alignItems: center
    backgroundColor: ${props =>
      props.weatherColor ? props.weatherColor : '#fff'};
`;
