// @flow
import React, {Component} from 'react';
import {StyleSheet, Text, TouchableOpacity, Image} from 'react-native';

export default class Channel extends Component {
  render() {
    const touchableStyles = [styles.channel];
    if (this.props.selected) touchableStyles.push(styles.selectedChannel);

    const textStyles = [styles.name];
    if (this.props.selected) textStyles.push(styles.selectedText);

    return (
      <TouchableOpacity style={touchableStyles} onPress={this.onSelect}>
        <Image
          style={styles.logo}
          resizeMode="contain"
          source={{uri: this.props.logoURL}}
        />
        <Text style={textStyles}>{this.props.name}</Text>
      </TouchableOpacity>
    );
  }

  onSelect = () => this.props.onSelectChannel(this.props.id);
}

const styles = StyleSheet.create({
  channel: {flex: 1, flexDirection: 'row', alignItems: 'center'},
  logo: {width: 64, height: 64, marginRight: 10},
  name: {fontSize: 30},
  selectedChannel: {backgroundColor: 'red'},
  selectedText: {color: 'white'}
});
