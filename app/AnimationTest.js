import {
  Button,
  Platform,
  StyleSheet,
  View,
  Animated,
  Dimensions
} from 'react-native';

import React from 'react';
import cards from './Cards';
import { StatusBar } from 'expo-status-bar';
import { getStatusBarHeight } from 'react-native-status-bar-height';


const Btn = (props) => {
  return <Button style={styles.btn} {...props} />;
}

class AnimationTest extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      index: 0,
      side: 'front',
      statusBarHeight: getStatusBarHeight(),
      fadeAnim: new Animated.Value(1),
      moveAnim: new Animated.ValueXY(),
      changingCard: false
    };

    this.animatedValue = new Animated.Value(0);
    this.value = 0;
    this.animatedValue.addListener(({ value }) => {
      this.value = value
    })
    this.frontInterpolate = this.animatedValue.interpolate({
      inputRange: [0, 180],
      outputRange: ['0deg', '180deg']
    })

    this.backInterpolate = this.animatedValue.interpolate({
      inputRange: [0, 180],
      outputRange: ['180deg', '360deg']
    })


  }


  moveIn = (direction) => {
    const screenWidth = Dimensions.get('window').width;

    if (direction === -1) {
      const animation2 = () => {
        this.setState({ index: this.state.index - 1, side: 'front', changingCard: false });
        this.state.moveAnim.setValue({ x: -screenWidth });

        Animated.parallel([
          Animated.timing(this.state.moveAnim, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true
          }),
          Animated.timing(this.state.fadeAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true
          })
        ]).start()
  
      }

      Animated.timing(this.state.fadeAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true
      }).start(animation2);

      
    } else {

      const animation2 = () => {
        this.setState({ index: this.state.index + 1, side: 'front', changingCard: false });
        this.state.moveAnim.setValue({ x: 0 });

        Animated.timing(this.state.fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }).start();
      }

      Animated.parallel([
        Animated.timing(this.state.moveAnim, {
          toValue: -screenWidth,
          duration: 400,
          useNativeDriver: true
        }),
        Animated.timing(this.state.fadeAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true
        })
      ]).start(animation2)
    }

  };

  render() {
    const index = this.state.index;
    const side = this.state.side;

    // const screenHeight = Dimensions.get('window').height;

    // const screenDimensionStyle = {
    //   width: screenWidth,
    //   height: screenHeight
    // }

    const frontAnimatedStyle = {
      transform: [
        { rotateX: this.frontInterpolate }
      ]
    }
    const backAnimatedStyle = {
      transform: [
        { rotateX: this.backInterpolate }
      ]
    }

    //const cardFace = cards[index][side];
    const bodyStyles = { marginTop: this.state.statusBarHeight };

    const cardFace = <Animated.View style={[styles.flipWrapper, { opacity: this.state.fadeAnim, left: this.state.moveAnim.x }]}>
      <Animated.View style={[backAnimatedStyle, styles.flipCard, styles.flipCardBack]}>
        {cards[index]['back']}
      </Animated.View>
      <Animated.View style={[styles.flipCard, frontAnimatedStyle]}>
        {cards[index]['front']}
      </Animated.View>
    </Animated.View>


    const ctrlStyles = {};
    if (Platform.OS === 'ios') {
      ctrlStyles.marginBottom = 15;
    }

    const btns = [];
    if (!this.state.changingCard && index > 0) {
      btns.push(<Btn key='prev' title='<<' onPress={this.prevCard} />);
    } else {
      btns.push(<Btn key='prev' title='<<' disabled={true} />);
    }
    if (side === 'front') {
      btns.push(<Btn key='flip' title='Reveal Answer' onPress={this.toggleSide} />);
    } else {
      btns.push(<Btn key='flip' title='Reveal Question' onPress={this.toggleSide} />);
    }
    if (!this.state.changingCard && index < cards.length - 1) {
      btns.push(<Btn key='next' title='>>' onPress={this.nextCard} />);
    } else {
      btns.push(<Btn key='next' title='>>' disabled={true} />);
    }

    return (
      <View style={styles.container}>
        <StatusBar hidden={false} barStyle='dark-content' />

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
    this.setState({ side: side === 'front' ? 'back' : 'front' });

    if (this.value >= 90) {
      Animated.spring(this.animatedValue, {
        toValue: 0,
        friction: 8,
        tension: 10,
        useNativeDriver: true
      }).start();
    } else {
      Animated.spring(this.animatedValue, {
        toValue: 180,
        friction: 8,
        tension: 10,
        useNativeDriver: true
      }).start();
    }

  };

  prevCard = () => {
    if (this.state.index <= 0) { return; }
    // this.setState({ index: this.state.index - 1, side: 'front' });
    this.setState({ changingCard: true });
    this.moveIn(-1);

  };

  nextCard = () => {
    if (this.state.index >= cards.length - 1) { return; }

    this.setState({ changingCard: true });

    // this.setState({ index: this.state.index + 1, side: 'front' });

    this.moveIn();
  };
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    flexDirection: 'column',
  },
  body: {
    flex: 1,
    margin: 7,
    position: 'relative',
  },
  ctrls: {
    padding: 7,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  btn: {
    marginLeft: 3,
    marginRight: 3,
  },
  flipWrapper: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  flipCard: {
    position: 'absolute',
    top: 0,
    left: 0,
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backfaceVisibility: 'hidden',
    height: '100%',
    width: '100%'
  },
  flipCardBack: {
    backgroundColor: 'lightgreen'
  }
});

export { AnimationTest as default };