import React from 'react';
import { Text, View, TextInput, StyleSheet, Dimensions, Alert } from 'react-native';
import Button from './Button';
import base64 from 'base-64';

class Profile extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            userInfo: this.props.info,
            userPassword: this.props.password,
            userToken: '',
            editable: false
        }
    }

    render() {
        const screenWidth = Math.round(Dimensions.get('window').width);
        const screenHeight = Math.round(Dimensions.get('window').height);
        return (
            <View style={{ alignItems: 'center', backgroundColor: '#ffefd2', width: screenWidth, height: screenHeight }}>
                <View style={{
                    flexDirection: 'row',
                    width: 350,
                    marginTop: 40,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Text style={{ fontSize: 30}}> Profile </Text>

                </View>

                <View style={styles.column}>
                    <Text style={{ fontSize: 25, color: '#4d3200' }}> Firstname: </Text>
                    <TextInput placeholder={this.state.userInfo.firstName}
                        style={this.state.editable ? styles.info_edit : styles.info_original}
                        editable={this.state.editable}
                        onChangeText={(firstname_temp) => this.setState(prevState => ({ userInfo: { ...prevState.userInfo, firstName: firstname_temp } }))}>
                    </TextInput>
                </View>

                <View style={styles.column}>
                    <Text style={{ fontSize: 25, color: '#4d3200' }}> Lastname: </Text>
                    <TextInput placeholder={this.state.userInfo.lastName}
                        style={this.state.editable ? styles.info_edit : styles.info_original}
                        editable={this.state.editable}
                        onChangeText={(lastname_temp) => this.setState(prevState => ({ userInfo: { ...prevState.userInfo, lastName: lastname_temp } }))}>
                    </TextInput>
                </View>

                <View style={styles.column}>
                    <Text style={{ fontSize: 25, color: '#4d3200' }}> Password: </Text>
                    <TextInput value={this.state.userPassword}
                        style={this.state.editable ? styles.info_edit : styles.info_original}
                        editable={this.state.editable}
                        onChangeText={(password_temp) => this.setState({ userPassword: password_temp })}>
                    </TextInput>
                </View>

                <View style={{
                    flexDirection: 'row',
                    width: 350,
                    marginTop: 50,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Text style={{ fontSize: 30}}> Daily Goal </Text>

                </View>

                <View style={styles.column}>
                    <Text style={{ fontSize: 25, color: '#4d3200' }}> Activity: </Text>
                    <TextInput value={this.state.userInfo.goalDailyActivity.toString()}
                        style={this.state.editable ? styles.info_edit : styles.info_original}
                        editable={this.state.editable}
                        onChangeText={(goalDailyActivity_temp) => this.setState(prevState => ({ userInfo: { ...prevState.userInfo, goalDailyActivity: goalDailyActivity_temp } }))}>
                    </TextInput>
                </View>

                <View style={styles.column}>
                    <Text style={{ fontSize: 25, color: '#4d3200' }}> Calories: </Text>
                    <TextInput value={this.state.userInfo.goalDailyCalories.toString()}
                        style={this.state.editable ? styles.info_edit : styles.info_original}
                        editable={this.state.editable}
                        onChangeText={(goalDailyCalories_temp) => this.setState(prevState => ({ userInfo: { ...prevState.userInfo, goalDailyCalories: goalDailyCalories_temp } }))}>
                    </TextInput>
                </View>

                <View style={styles.column}>
                    <Text style={{ fontSize: 25, color: '#4d3200' }}> Carbohydrates: </Text>
                    <TextInput value={this.state.userInfo.goalDailyCarbohydrates.toString()}
                        style={this.state.editable ? styles.info_edit : styles.info_original}
                        editable={this.state.editable}
                        onChangeText={(goalDailyCarbohydrates_temp) => this.setState(prevState => ({ userInfo: { ...prevState.userInfo, goalDailyCarbohydrates: goalDailyCarbohydrates_temp } }))}>
                    </TextInput>
                </View>

                <View style={styles.column}>
                    <Text style={{ fontSize: 25, color: '#4d3200' }}> Fat: </Text>
                    <TextInput value={this.state.userInfo.goalDailyFat.toString()}
                        style={this.state.editable ? styles.info_edit : styles.info_original}
                        editable={this.state.editable}
                        onChangeText={(goalDailyFat_temp) => this.setState(prevState => ({ userInfo: { ...prevState.userInfo, goalDailyFat: goalDailyFat_temp } }))}>
                    </TextInput>
                </View>

                <View style={styles.column}>
                    <Text style={{ fontSize: 25, color: '#4d3200' }}> Protein: </Text>
                    <TextInput value={this.state.userInfo.goalDailyProtein.toString()}
                        style={this.state.editable ? styles.info_edit : styles.info_original}
                        editable={this.state.editable}
                        onChangeText={(goalDailyProtein_temp) => this.setState(prevState => ({ userInfo: { ...prevState.userInfo, goalDailyProtein: goalDailyProtein_temp } }))}>
                    </TextInput>
                </View>

                <View style={{
                    width: 350,
                    alignItems: 'center'
                }}>
                <Button buttonStyle={styles.edit_button}
                    textStyle={{ color: '#ffc04f', fontSize: 25 }}
                    text={this.state.editable ? 'Save' : 'Edit'}
                    onPress={() => {
                        this.state.editable ? this.uploadInfo() : {};
                        this.setState({ editable: !this.state.editable })
                        }
                    }/>
                </View>


                <View style={{
                    width: 350,
                    alignItems: 'center'
                }}>
                <Button buttonStyle={styles.delete_button}
                    textStyle={{ color: '#ff5235', fontSize: 25 }}
                    text={'Delete Account'}
                    onPress={() => this.deletAccount()}
                    />
                </View>
            </View>
        )
    }

    // fetchInfo() {
        // fetch('https://mysqlcs639.cs.wisc.edu/users/' + this.props.username, {
        //     method: 'GET',
        //     headers: { 'x-access-token': this.props.token },
        //     redirect: 'follow'
        // }).then(response => response.json()).then(info => {
        //     if (info.message) {
        //         Alert.alert(info.message);
        //     }
        //     this.setState({userInfo: info});
        // })
        
    // }

    deletAccount() {

        fetch('https://mysqlcs639.cs.wisc.edu/users/' + this.props.username, {
          method: 'DELETE',
          headers: {'x-access-token': this.props.token, 'Content-Type': 'application/json'},
          redirect: "follow"
        }).then(newresponse => newresponse.json()).then(newresult => {Alert.alert(newresult.message)})
        this.props.callBackLogOut();
    }

    async uploadInfo() {
        let obj = JSON.parse(JSON.stringify(this.state.userInfo));
        obj.password = this.state.userPassword;

        let response_1 = await fetch('https://mysqlcs639.cs.wisc.edu/login', {
            method: 'GET',
            headers: { 'Authorization': 'Basic ' + base64.encode(this.props.info.username + ":" + this.props.password) },
            redirect: 'follow'
        });
        let result = await response_1.json();
        this.setState({ userToken: result.token });

        let response_2 = await fetch('https://mysqlcs639.cs.wisc.edu/users/' + this.props.info.username, {
            method: 'PUT',
            headers: { 'x-access-token': result.token, 'Content-Type': 'application/json' },
            redirect: 'follow',
            body: JSON.stringify(obj)
        });
        let result_2 = await response_2.json();
        Alert.alert(result_2.message);

        // this.fetchInfo();
    }
}

const styles = StyleSheet.create({
    edit_button: {
        marginTop: 30,
        width: 70,
        height: 40,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#ffc04f',
        alignItems: 'center',
        justifyContent: 'center',
    },
    delete_button: {
        marginTop: 30,
        width: 200,
        height: 40,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#ff5235',
        alignItems: 'center',
        justifyContent: 'center',
    },
    info_original: {
        fontSize: 28,
        position: 'absolute',
        right: 0,
        color: '#ffab12'
    },
    info_edit: {
        fontSize: 28,
        position: 'absolute',
        right: 0,
        color: '#b4aa98'
    },
    column: {
        flexDirection: 'row',
        width: 350,
        marginTop: 20,
        marginLeft: 0,
        alignItems: 'center'
    }

});

export default Profile;