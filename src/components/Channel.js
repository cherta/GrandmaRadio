/**
 * @flow
 */
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Image
} from 'react-native';

export default class Channel extends Component {
  render() {
    return (
      <TouchableOpacity style={styles.channel} onPress={this.onSelect}>
        <Image style={styles.logo} source={{uri: this.props.logoURL}} />
        <Text style={styles.name}>{this.props.name}</Text>
      </TouchableOpacity>
    );
  }

  onSelect = () => this.props.onSelectChannel(this.props.id)
}

const styles = StyleSheet.create({
  channel: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  logo: {
    width: 64,
    height: 64
  },
  name: {
    fontSize: 20
  }
});
