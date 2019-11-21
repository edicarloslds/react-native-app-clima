import React, {Component} from 'react';
import {
  Platform,
  PermissionsAndroid,
  ToastAndroid,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Weather from '@components/Weather';
import {weatherConditions} from '@utils/WeatherConditions';

import {Container} from './styles';
import {API_KEY} from '@utils/OpenWeatherMap'; //TODO: move to .env

export default class Main extends Component {
  state = {
    location: null,
    isLoading: true,
    temperature: 0,
    weather: null,
    description: '',
    localName: '',
  };

  componentDidMount() {
    this.getCurrentWeather();
  }

  getCurrentWeather = async () => {
    this.setState({isLoading: true});

    const hasLocationPermission = await this.hasLocationPermission();
    if (!hasLocationPermission) {
      return;
    }

    // get user current localion
    Geolocation.getCurrentPosition(
      position => {
        console.log('position', position);
        this.fetchWeatherData(
          position.coords.latitude,
          position.coords.longitude,
        );
      },
      error => {
        this.setState({isLoading: false});
        Alert.alert('Erro ao exibir o clima', error.message);
      },
      {enableHighAccuracy: true, timeout: 10000, maximumAge: 3000},
    );
  };

  // get weather data from openweathermap API
  fetchWeatherData(lat, lon) {
    fetch(
      `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=${API_KEY}&units=metric&lang=pt_br`,
    )
      .then(res => res.json())
      .then(data => {
        console.log('data', data);
        this.setState({
          isLoading: false,
          temperature: data.main.temp,
          weather: data.weather[0].main,
          description: data.weather[0].description,
          localName: data.name,
        });
      });
  }

  // check if location permission in Android is already granted by the user
  hasLocationPermission = async () => {
    if (
      Platform.OS === 'ios' ||
      (Platform.OS === 'android' && Platform.Version < 23)
    ) {
      return true;
    }

    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (hasPermission) {
      return true;
    }

    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (status === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    }

    if (status === PermissionsAndroid.RESULTS.DENIED) {
      ToastAndroid.show(
        'Permissão de localização negada pelo usuário.',
        ToastAndroid.LONG,
      );
    } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      ToastAndroid.show(
        'Permissão de localização revogada pelo usuário.',
        ToastAndroid.LONG,
      );
    }

    return false;
  };

  render() {
    const {
      isLoading,
      temperature,
      weather,
      localName,
      description,
    } = this.state;

    // This will be associated data from API with pre-defining weather conditions
    const weatherColor = weather ? weatherConditions[weather].color : '#92A0A4';
    const weatherIcon = weather
      ? weatherConditions[weather].icon
      : 'cloud-off-outline';

    return (
      <Container weatherColor={weatherColor}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#282C34" />
        ) : (
          <>
            <Weather
              description={description}
              temperature={temperature.toFixed(0)}
              weatherIcon={weatherIcon}
              localName={localName}
            />
            <TouchableOpacity onPress={this.getCurrentWeather}>
              <Icon size={48} name="refresh" color={'#fff'} />
            </TouchableOpacity>
          </>
        )}
      </Container>
    );
  }
}
