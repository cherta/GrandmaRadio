import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    DeviceEventEmitter,
    ActivityIndicator
} from 'react-native';
import { ReactNativeAudioStreaming } from 'react-native-audio-streaming';
import Button from 'apsl-react-native-button';

// Possibles states
const PLAYING = 'PLAYING';
const STREAMING = 'STREAMING';
const PAUSED = 'PAUSED';
const STOPPED = 'STOPPED';
const ERROR = 'ERROR';
const METADATA_UPDATED = 'METADATA_UPDATED';
const BUFFERING = 'BUFFERING';
const START_PREPARING = 'START_PREPARING'; // Android only
const BUFFERING_START = 'BUFFERING_START'; // Android only

// UI
const iconSize = 60;

export default class Player extends Component {
    constructor(props) {
      super(props);
      this._onPress = this._onPress.bind(this);
      this.state = {
        status: STOPPED,
        song: ''
      };
    }

    componentWillReceiveProps(nextProps) {
      if (this.props.url !== nextProps.url) {
        ReactNativeAudioStreaming.stop();
        setTimeout(
          () => ReactNativeAudioStreaming.play(this.props.url, { showIniOSMediaCenter: false, showInAndroidNotifications: true }),
          1000
        );

      }
    }

    componentDidMount() {
      this.subscription = DeviceEventEmitter.addListener(
        'AudioBridgeEvent', (evt) => {
          // We just want meta update for song name
          if (evt.status === METADATA_UPDATED && evt.key === 'StreamTitle') {
            this.setState({song: evt.value});
          } else if (evt.status != METADATA_UPDATED) {
            this.setState(evt);
          }
        }
      );

      ReactNativeAudioStreaming.getStatus((error, status) => {
        (error) ? console.log(error) : this.setState(status)
      });
    }

    _onPress() {
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
          ReactNativeAudioStreaming.play(this.props.url, {showIniOSMediaCenter: false, showInAndroidNotifications: true});
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
            icon = '॥';
            break;
          case PAUSED:
          case STOPPED:
          case ERROR:
            icon = '▸';
            break;
        }

        return (
          <View style={styles.container}>
            <Button
              isLoading={this.state.status === START_PREPARING}
              style={{borderColor: '#f39c12', backgroundColor: '#f1c40f', flex: 1, borderRadius: 0}}
              textStyle={{fontSize: 100, color: 'white'}}
              onPress={this._onPress}>
              {icon}
            </Button>
          </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
    },
    icon: {
      color: '#000',
      fontSize: 26,
      borderColor: '#000033',
      borderWidth: 1,
      borderRadius: iconSize / 2,
      width: iconSize,
      height: 60,
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      paddingTop: 0
    },
    textContainer: {
      flexDirection: 'column',
      margin: 10
    },
    textLive: {
      color: '#000',
      marginBottom: 5
    },
    songName: {
      fontSize: 20,
      textAlign: 'center',
      color: '#000'
    }
});
