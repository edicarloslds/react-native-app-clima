import React, {Component} from 'react';
import {
  Platform,
  PermissionsAndroid,
  ToastAndroid,
  ActivityIndicator,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';

import Weather from '../../components/Weather';
import {weatherConditions} from '../../utils/WeatherConditions';

import {Container} from './styles';
import {API_KEY} from '../../utils/OpenWeatherMap'; //TODO: move to .env

export default class Main extends Component {
  state = {
    location: null,
    isLoading: true,
    temperature: 0,
    weather: null,
    description: '',
    localName: '',
  };

  async componentDidMount() {
    const hasLocationPermission = await this.hasLocationPermission();

    if (!hasLocationPermission) {
      return;
    }

    // get user current localion
    Geolocation.getCurrentPosition(
      position => {
        this.fetchWeatherData(
          position.coords.latitude,
          position.coords.longitude,
        );
      },
      error => {
        this.setState({
          error: `Erro ao exibir os dados do clima: ${error}`,
        });
      },
    );
  }

  // get weather data from openweathermap API
  fetchWeatherData(lat = 25, lon = 25) {
    fetch(
      `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=${API_KEY}&units=metric&lang=pt_br`,
    )
      .then(res => res.json())
      .then(data => {
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
    const weatherColor = weather ? weatherConditions[weather].color : null;
    const weatherIcon = weather ? weatherConditions[weather].icon : '';

    return (
      <Container weatherColor={weatherColor}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#282C34" />
        ) : (
          <Weather
            description={description}
            temperature={temperature.toFixed(0)}
            weatherIcon={weatherIcon}
            localName={localName}
          />
        )}
      </Container>
    );
  }
}
