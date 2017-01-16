/**
 * @flow
 */
import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Orientation from 'react-native-orientation';

import { CHANNELS_URL, DEFAULT_CHANNEL_LIST } from './config';
import { values, normalize } from './utils';

import ChannelList from './components/ChannelList';
import Player from './components/Player';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: {},
      current: null
    };
  }

  componentDidMount() {
    Orientation.lockToLandscape();
    fetch(CHANNELS_URL)
      .then(response => response.json())
      .then(
        json => normalize(json.channels),
        _ => normalize(DEFAULT_CHANNEL_LIST.channels)
      )
      .then(list => this.setState({ list }));
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.channels}>
          <ChannelList
            selected={this.state.current}
            list={values(this.state.list)}
            onChange={this.onSelectChannel}
          />
        </View>
        <View style={styles.player}>
          { !this.state.list[this.state.current]
            ? <Text>Seleccione una emisora</Text>
            : <Player url={this.state.list[this.state.current].playbackURL} /> }
        </View>
      </View>
    );
  }

  onSelectChannel = (channelId) => {
    this.setState(
      { current: channelId }
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row'
  },
  channels: {
    flex: 1
  },
  player: {
    flex: 1
  },
});
