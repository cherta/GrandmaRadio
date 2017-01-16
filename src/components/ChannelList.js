/**
 * @flow
 */
import React, { Component } from 'react';
import { ScrollView } from 'react-native';
import Channel from './Channel';

export default class ChannelList extends Component {
  render() {
    return (
      <ScrollView>
        { this.props.list.map((channel, key) =>
          <Channel
            key={key}
            {...channel}
            selected={this.props.selected === channel.id}
            onSelectChannel={this.props.onChange}
          />) }
      </ScrollView>
    );
  }
}
