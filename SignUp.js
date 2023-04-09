import React from 'react';
import { StyleSheet, TextInput, View, TouchableWithoutFeedback, KeyboardAvoidingView, Dimensions, Alert } from 'react-native';
import Button from './Button';

class SignUp extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: ''
    }
  }
  render() {
    if (this.props.show) {
      const screenWidth = Math.round(Dimensions.get('window').width);
      const screenHeight = Math.round(Dimensions.get('window').height);

      return (
        <View style={{ position: 'absolute', backgroundColor: '#ffefd2' }}>
          <TouchableWithoutFeedback onPress={() => this.props.hide()}>
            <View style={{ width: screenWidth, height: screenHeight, backgroundColor: '#c1a573', opacity: 0.75 }}></View>
          </TouchableWithoutFeedback>
          <View style={{ position: 'absolute', width: this.props.width, height: this.props.height, left: (screenWidth - this.props.width) / 2, top: (screenHeight - this.props.height) / 2, backgroundColor: '#ffefd2', borderRadius: 10 }}>
            <View style = {{marginTop:150}}>
              <KeyboardAvoidingView>
                <TextInput style={styles.input} placeholder='username' onChangeText={(username) => this.setState({ username })} />

                <TextInput style={styles.input} placeholder='password' secureTextEntry={true} onChangeText={(password) => this.setState({ password })} />

                <Button buttonStyle={styles.button}
                  textStyle={{ color: '#ffffff', fontSize: 20 }}
                  text={'Sign up'}
                  onPress={() => this.signUp()} />

              </KeyboardAvoidingView>
            </View>

            <Button buttonStyle={{ alignItems: 'center', justifyContent: 'center', width: 70, height: 70, position: 'absolute', right: 0 }} textStyle={{ fontSize: 25 }} text={'✕'} onPress={() => this.props.hide()} />
          </View>
        </View>
      )
    }
    return (<View></View>)
  }

  signUp() {
    fetch('https://mysqlcs639.cs.wisc.edu/users', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'x-access-token': '',
    },
      body: JSON.stringify({username: this.state.username, password: this.state.password}),
      redirect: 'follow'
    }).then(response => response.json()).then(result => {
        if (result.message.includes('created')) {this.props.hide();}
        Alert.alert(result.message);
      }).catch((error) => { console.error(error);});
  }
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    width: 200,
    marginTop: 10,
    marginLeft: 47,
    borderColor: 'gray',
    fontSize: 25,
    padding: 10,
    borderWidth: 0.5,
    borderRadius: 3
  },
  button: {
    backgroundColor: '#ffc04f',
    alignItems: 'center',
    justifyContent: 'center',
    width: 200,
    marginTop: 15,
    marginLeft: 47,
    padding: 10,
    borderRadius: 10
  },
});

export default SignUp;
