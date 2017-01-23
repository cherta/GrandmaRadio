// @flow
import React, {Component} from 'react';
import {ListView} from 'react-native';
import Channel from './Channel';

const dataSource = (list) => new ListView.DataSource({
  rowHasChanged: (channel1, channel2) => channel1.id !== channel2.id
}).cloneWithRows(list)

export default class ChannelList extends Component {
  render() {
    return (
      <ListView
        enableEmptySections
        dataSource={dataSource(this.props.list)}
        renderRow={(channel) => (
          <Channel
            {...channel}
            onSelectChannel={this.props.onChange}
            selected={this.props.selected === channel.id}
          />
        )}
      />
    );
  }
}
