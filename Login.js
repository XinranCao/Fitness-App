import React from 'react';
import { StyleSheet, TextInput, Text, View, KeyboardAvoidingView, Dimensions, Alert } from 'react-native';
import Button from './Button';
import SignUp from './SignUp';
import base64 from 'base-64';

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showSignUp: false,
            username: '',
            password: '',
            token: ''
        }
    }

    render() {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>

                <KeyboardAvoidingView>
                    <TextInput style={styles.input} placeholder='username' onChangeText={(username) => this.setState({ username })} />
                    <TextInput style={styles.input} placeholder='password' secureTextEntry={true} onChangeText={(password) => this.setState({ password })} />

                    <Button buttonStyle={styles.button}
                        textStyle={{ color: '#ffffff', fontSize: 20 }}
                        text={'Log in'} onPress={() => this.login()} />

                    <Button buttonStyle={{ color: '#ffffff', alignItems: 'center', justifyContent: 'center', marginTop: 15, }}
                        textStyle={{ color: '#ffc04f', fontSize: 20 }}
                        text={'No account? Sign up now!'} onPress={() => this.showSignUp()} />
                </KeyboardAvoidingView>

                <SignUp width={300} height={600} show={this.state.showSignUp} hide={() => this.hideSignUp()} />


            </View>
        )
    }

    showSignUp() {
        this.setState({ showSignUp: true });
    }

    hideSignUp() {
        this.setState({ showSignUp: false });
    }

    login() {

        fetch('https://mysqlcs639.cs.wisc.edu/login', {
            method: 'GET',
            headers: { 'Authorization': 'Basic ' + base64.encode(this.state.username + ":" + this.state.password) },
            redirect: 'follow'
        }).then(response_1 => response_1.json()).then(result => {
            this.setState({ token: result.token });
            fetch('https://mysqlcs639.cs.wisc.edu/users/' + this.state.username, {
                method: 'GET',
                headers: { 'x-access-token': result.token },
                redirect: 'follow'
            }).then(response_2 => response_2.json()).then(info => {
                if (info.message) {
                    Alert.alert(info.message);
                }
                this.props.callBackToApp(this.state.token, info, this.state.username, this.state.password);
            })
        })


        // let response_1 = await fetch('https://mysqlcs639.cs.wisc.edu/login', {
        //     method: 'GET',
        //     headers: { 'Authorization': 'Basic ' + base64.encode(this.state.username + ":" + this.state.password) },
        //     redirect: 'follow'
        // });
        // let result = await response_1.json();

        // this.setState({ token: result.token });

        // let response_2 = await fetch('https://mysqlcs639.cs.wisc.edu/users/' + this.state.username, {
        //     method: 'GET',
        //     headers: { 'x-access-token': result.token },
        //     redirect: 'follow'
        // });
        // let info = await response_2.json();

        // if (info.message) {
        //     Alert.alert(info.message);
        // }
        // this.props.callBackToApp(this.state.token, info, this.state.password);
    }
}

const styles = StyleSheet.create({
    input: {
        height: 40,
        width: 300,
        marginTop: 10,
        borderColor: '#ffc04f',
        fontSize: 25,
        padding: 10,
        borderWidth: 0.5,
        borderRadius: 3
    },
    button: {
        backgroundColor: '#ffc04f',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 15,
        padding: 10,
        borderRadius: 10
    },
});

export default Login;