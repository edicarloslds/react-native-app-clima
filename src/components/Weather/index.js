import React from 'react';

import {Container, Header, Body, TempText, Title, Subtitle} from './styles';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function Weather({
  weatherTitle,
  temperature,
  weatherIcon,
  localName,
}) {
  return (
    <Container>
      <Header>
        <Icon size={150} name={weatherIcon} color={'#fff'} />
        <TempText>{temperature}˚C</TempText>
      </Header>
      <Body>
        <Title>{localName}</Title>
        <Subtitle>{weatherTitle}</Subtitle>
      </Body>
    </Container>
  );
}
