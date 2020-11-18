import {
  Button,
  Platform,
  StyleSheet,
  View,
} from 'react-native';

import React                from 'react';
import cards                from './Cards';
import {StatusBar}          from 'expo-status-bar';
import {getStatusBarHeight} from 'react-native-status-bar-height';


const Btn = (props) => {
  return <Button style={styles.btn} {...props} />;
}

class AnimationTest extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      index:            0,
      side:             'front',
      statusBarHeight:  getStatusBarHeight(),
    };
  }

  render = () => {
    const index    = this.state.index;
    const side     = this.state.side;
    const cardFace = cards[index][side];

    const bodyStyles = {marginTop: this.state.statusBarHeight};
    const ctrlStyles = {};
    if (Platform.OS === 'ios') {
      ctrlStyles.marginBottom = 15;
    }

    const btns = [];
    if (index > 0) {
      btns.push(<Btn key='prev' title='<<' onPress={this.prevCard} />);
    } else {
      btns.push(<Btn key='prev' title='<<' disabled={true} />);
    }
    if (side === 'front') {
      btns.push(<Btn key='flip' title='Reveal Answer' onPress={this.toggleSide} />);
    } else {
      btns.push(<Btn key='flip' title='Reveal Question' onPress={this.toggleSide} />);
    }
    if (index < cards.length - 1) {
      btns.push(<Btn key='next' title='>>' onPress={this.nextCard} />);
    } else {
      btns.push(<Btn key='next' title='>>' disabled={true} />);
    }

    return (
      <View style={styles.container}>
        <StatusBar hidden={false} barStyle='dark-content'/>

        <View style={[bodyStyles, styles.body]}>
          {cardFace}
        </View>

        <View style={[ctrlStyles, styles.ctrls]}>
          {btns}
        </View>
      </View>
    );
  };

  toggleSide = () => {
    const side = this.state.side;
    this.setState({side: side === 'front' ? 'back' : 'front'});
  };

  prevCard = () => {
    if (this.state.index <= 0) { return; }

    this.setState({index: this.state.index - 1, side: 'front'});
  };

  nextCard = () => {
    if (this.state.index >= cards.length - 1) { return; }

    this.setState({index: this.state.index + 1, side: 'front'});
  };
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex:            1,
    flexDirection:   'column',
  },
  body: {
    flex:    1,
    padding: 7,
  },
  ctrls: {
    padding: 7,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  btn: {
    marginLeft:  3,
    marginRight: 3,
  },
});

export {AnimationTest as default};