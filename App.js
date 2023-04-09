import React from 'react';
import { Text,View, Dimensions} from 'react-native';
import MainPage from './MainPage';
import Login from './Login';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userToken: '',
      userName: '',
      userPassword: '',
      userInfo: {}
    }
  }

  render() {

    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffefd2'}}>
        {this.inLogin()}
        {this.inMainPage()}
      </View>
    );
  }

  inMainPage() {
    const screenWidth = Math.round(Dimensions.get('window').width);
    const screenHeight = Math.round(Dimensions.get('window').height);
    if (this.state.userToken){
      let param = {
        token: this.state.userToken,
        info: this.state.userInfo,
        username: this.state.userName,
        password: this.state.userPassword,
        callBackLogOut: this.logOut
      }
      return ( 
        <View style={{width: screenWidth, height: screenHeight}}>
          <MainPage screenProps = {param}/>
        </View>
      )
    }
  }

  inLogin() {
    if (!this.state.userToken){
      return (  
        <Login callBackToApp = {(token, info, username, password) => this.getMessage(token, info, username, password)}/>
      )
    }
  }
  
  getMessage(token, info, username, password){
    this.setState({userToken: token, userInfo: info, userName: username, userPassword: password});
  }

  logOut = () => {
    this.setState({
      userToken: '',
      userName: '',
      userPassword: '',
      userInfo: {}
    });
  }

}

export default App;
