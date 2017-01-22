// @flow
import React, {Component} from 'react';
import {
  Vibration,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  DeviceEventEmitter,
  ActivityIndicator
} from 'react-native';
import {ReactNativeAudioStreaming} from 'react-native-audio-streaming';
import Button from 'apsl-react-native-button';

// Possibles states
const PLAYING = 'PLAYING';
const STREAMING = 'STREAMING';
const PAUSED = 'PAUSED';
const STOPPED = 'STOPPED';
const ERROR = 'ERROR';
const METADATA_UPDATED = 'METADATA_UPDATED';
const BUFFERING = 'BUFFERING';
const START_PREPARING = 'START_PREPARING';
const BUFFERING_START = 'BUFFERING_START';

const PLAY_OPTIONS = {
  showIniOSMediaCenter: false,
  showInAndroidNotifications: true
};

export default class Player extends Component {
  constructor(props) {
    super(props);
    this._onPress = this._onPress.bind(this);
    this.state = {status: STOPPED};
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.url !== nextProps.url) {
      ReactNativeAudioStreaming.stop();
      setTimeout(() => ReactNativeAudioStreaming.play(nextProps.url, PLAY_OPTIONS), 500);
    }
  }

  componentDidMount() {
    this.subscription = DeviceEventEmitter.addListener(
      'AudioBridgeEvent',
      evt => {
        // We just want meta update for song name
        if (evt.status === METADATA_UPDATED && evt.key === 'StreamTitle') {
          this.setState({song: evt.value});
        } else if (evt.status != METADATA_UPDATED) {
          this.setState(evt);
        }
      }
    );

    ReactNativeAudioStreaming.getStatus((error, status) => {
      error ? console.log(error) : this.setState(status);
    });

    ReactNativeAudioStreaming.play(this.props.url, PLAY_OPTIONS);
  }

  _onPress() {
    Vibration.vibrate();
    switch (this.state.status) {
      case PLAYING:
      case STREAMING:
        ReactNativeAudioStreaming.pause();
        break;
      case PAUSED:
        ReactNativeAudioStreaming.resume();
        break;
      case STOPPED:
      case ERROR:
        ReactNativeAudioStreaming.play(this.props.url, PLAY_OPTIONS);
        break;
      case BUFFERING:
        ReactNativeAudioStreaming.stop();
        break;
    }
  }

  render() {
    let icon = null;
    switch (this.state.status) {
      case PLAYING:
      case STREAMING:
        icon = '\u0965';
        break;
      case PAUSED:
      case STOPPED:
      case ERROR:
        icon = '\u25B8';
        break;
    }
    return (
      <View style={styles.container}>
        <Button
          isLoading={this.state.status === START_PREPARING}
          style={styles.button}
          textStyle={styles.buttonText}
          onPress={this._onPress}
        >
          {icon}
        </Button>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {justifyContent: 'center', alignItems: 'center', flex: 1},
  button: {
    borderColor: '#f39c12',
    backgroundColor: '#f1c40f',
    flex: 1,
    borderRadius: 0
  },
  buttonText: {fontSize: 100, color: 'white'}
});
