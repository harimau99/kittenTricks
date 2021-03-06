import React from 'react';
import {
  FlatList,
  View,
  Platform,
  Image
} from 'react-native';
import {
  RkButton,
  RkText,
  RkTextInput,
  RkAvoidKeyboard,
  RkStyleSheet,
  RkTheme
} from 'react-native-ui-kitten';
import _ from 'lodash';
import {FontAwesome} from '../../assets/icons';
import {Data} from '../../data';
import {Avatar} from '../../components/avatar';
let moment = require('moment');

export class Chat extends React.Component {

  static navigationOptions = ({navigation}) => {
    let renderAvatar = (user) => {
      return (<Avatar style={styles.avatar} rkType='small' img={user.photo}/>);
    };

    let renderTitle = (user) => {
      return (
        <View style={styles.header}>
          <RkText rkType='header5'>{`${user.firstName} ${user.lastName}`}</RkText>
          <RkText rkType='secondary3 secondaryColor'>Online</RkText>
        </View>
      )
    };

    let userId = 1;
    let user = Data.getUser(userId);
    let rightButton = renderAvatar(user);
    let title = renderTitle(user);
    return (
      {
        headerTitle: title,
        headerRight: rightButton
      });
  };

  constructor(props) {
    super(props);
    let userId = 1;
    let conversation = Data.getConversation(userId);

    this.state = {
      data: conversation
    };
  }

  _keyExtractor(post, index) {
    return post.id;
  }

  _renderItem(info) {
    let inMessage = info.item.type === 'in';
    let backgroundColor = inMessage
      ? RkTheme.current.colors.chat.messageInBackground
      : RkTheme.current.colors.chat.messageOutBackground;
    let itemStyle = inMessage ? styles.itemIn : styles.itemOut;

    let renderDate = (date) => (
      <RkText style={styles.time} rkType='secondary7 hintColor'>
        {moment().add(date, 'seconds').format('LT')}
      </RkText>);

    return (
      <View style={[styles.item, itemStyle]}>
        {!inMessage && renderDate(info.item.date)}
        <View style={[styles.balloon, {backgroundColor}]}>
          <RkText rkType='primary2 mediumLine chat'>{info.item.text}</RkText>
        </View>
        {inMessage && renderDate(info.item.date)}
      </View>
    )
  }

  _scroll() {
    let scroll = () => {
      this.refs.list.scrollToIndex(
        {viewPosition: 1, index: this.state.data.length - 1});
    };

    if (Platform.OS === 'ios') {
      scroll();
    } else {
      _.delay(scroll, 100);
    }
  }

  _pushMessage() {
    if (!this.state.message)
      return;
    let msg = {
      id: this.state.data.length,
      date: new Date(),
      type: 'out',
      text: this.state.message
    };

    let data = this.state.data;
    data.push(msg);
    this.setState({
      data,
      message: ''
    });
    this._scroll(true);
  }

  render() {
    return (
      <RkAvoidKeyboard style={styles.container}>
        <FlatList ref='list'
                  extraData={this.state}
                  style={styles.list}
                  data={this.state.data}
                  keyExtractor={this._keyExtractor}
                  renderItem={this._renderItem}/>
        <View style={styles.footer}>
          <RkButton style={styles.plus} rkType='clear'>
            <RkText rkType='awesome secondaryColor'>{FontAwesome.plus}</RkText>
          </RkButton>

          <RkTextInput
            onFocus={() => this._scroll(true)}
            onBlur={() => this._scroll(true)}
            onChangeText={(message) => this.setState({message})}
            value={this.state.message}
            rkType='row sticker'
            placeholder="Add a comment..."/>

          <RkButton onPress={() => this._pushMessage()} style={styles.send} rkType='circle highlight'>
            <Image source={require('../../assets/icons/sendIcon.png')}/>
          </RkButton>
        </View>
      </RkAvoidKeyboard>

    )
  }
}

let styles = RkStyleSheet.create(theme => ({
  header: {
    alignItems: 'center'
  },
  avatar: {
    marginRight: 16,
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.screen.base
  },
  list: {
    paddingHorizontal: 17
  },
  footer: {
    flexDirection: 'row',
    minHeight: 60,
    padding: 10,
    backgroundColor: theme.colors.screen.alter
  },
  item: {
    marginVertical: 14,
    flex: 1,
    flexDirection: 'row'
  },
  itemIn: {},
  itemOut: {
    alignSelf: 'flex-end'
  },
  balloon: {
    maxWidth: 250,
    padding: 15,
    borderRadius: 20,
  },
  time: {
    alignSelf: 'flex-end',
    margin: 15
  },
  plus: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginRight: 7
  },
  send: {
    width: 40,
    height: 40,
    marginLeft: 10,
  }
}));