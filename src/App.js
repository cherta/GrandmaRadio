// @flow
import React, {Component} from 'react';
import {
  Vibration,
  StyleSheet,
  View,
  Text,
  UIManager,
  LayoutAnimation
} from 'react-native';
import Orientation from 'react-native-orientation';

import {CHANNELS_URL, DEFAULT_CHANNEL_LIST} from './config';
import {values, normalize} from './utils';

import ChannelList from './components/ChannelList';
import Player from './components/Player';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {list: {}, current: null, otientation: null};
    UIManager.setLayoutAnimationEnabledExperimental &&
      UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  componentWillUpdate() {
    LayoutAnimation.easeInEaseOut();
  }

  componentDidMount() {
    Orientation.addOrientationListener(this.orientationChanged);
    this.orientationChanged(Orientation.getInitialOrientation());
    fetch(CHANNELS_URL)
      .then(response => response.json())
      .then(
        json => normalize(json.channels),
        _ => normalize(DEFAULT_CHANNEL_LIST.channels)
      )
      .then(list => this.setState({list}));
  }

  orientationChanged = orientation => this.setState({orientation});
  render() {
    const flexDirection = this.state.orientation === 'LANDSCAPE'
      ? {flexDirection: 'row'}
      : {flexDirection: 'column'};
    return (
      <View style={[styles.container, flexDirection]}>
        <View style={styles.channels}>
          <ChannelList
            selected={this.state.current}
            list={values(this.state.list)}
            onChange={this.onSelectChannel}
          />
        </View>
        {this.state.list[this.state.current] && (
              <View style={styles.player}>
                <Player url={this.state.list[this.state.current].playbackURL} />
              </View>
            )}
      </View>
    );
  }

  onSelectChannel = channelId => {
    this.setState({current: channelId});
    Vibration.vibrate();
  };
}

const styles = StyleSheet.create({
  container: {flex: 1},
  channels: {flex: 1},
  player: {flex: 1}
});
