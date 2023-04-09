import React from 'react';
import { StyleSheet, TextInput, Text, View, KeyboardAvoidingView, ScrollView, Dimensions, Alert } from 'react-native';
import { Card } from 'react-native-paper';
import DatePicker from 'react-native-datepicker'
import Button from './Button';
import base64 from 'base-64';

class Activity extends React.Component {
    constructor(props) {
        super(props);
        this.newActivity = {};
        this.editList = {};
        this.today = new Date();
        this.state = {
            isFirstTime: true,
            userActivities: [],
            editActivity: {}
        }
    }

    render() {
        const screenWidth = Math.round(Dimensions.get('window').width);
        const screenHeight = Math.round(Dimensions.get('window').height);
        if (this.state.isFirstTime) { this.fetchActivities() }
        return (
            <View style = {{flex:1, backgroundColor: '#ffefd2'}}>
            <ScrollView contentContainerStyle={{ alignItems: 'center', backgroundColor: '#ffefd2' }}>

                <Card style={{ width: 400, height: 220, marginTop: 30, backgroundColor: '#fff6e6' }}>

                    <View style={{
                        flexDirection: 'row',
                        marginTop: 10,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Text style={{ fontSize: 30 }}>Add New Activity</Text>
                    </View>


                    <Button buttonStyle={styles.button}
                        textStyle={{ color: '#ffffff', fontSize: 30, marginLeft: 11 }}
                        text={'+'} onPress={() => this.addActivity()} />


                    <View style={{ marginTop: 15 }}>

                        <View style={{
                            flexDirection: 'row',
                            marginTop: 15,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <Text style={styles.addFont}>Activity Name: </Text>

                            <TextInput style={styles.inputFont} placeholder='enter activity name' onChangeText={(text) => this.newActivity.name = text}></TextInput>
                        </View>

                        <View style={{
                            flexDirection: 'row',
                            marginTop: 35,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <Text style={styles.addFont}>Duration: </Text>

                            <TextInput style={styles.inputFont} placeholder='enter duration (mins)' onChangeText={(text) => this.newActivity.duration = parseFloat(text)}></TextInput>
                        </View>

                        <View style={{
                            flexDirection: 'row',
                            marginTop: 35,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <Text style={styles.addFont}>Calories: </Text>

                            <TextInput style={styles.inputFont} placeholder='enter calories burned' onChangeText={(text) => this.newActivity.calories = parseFloat(text)}></TextInput>
                        </View>

                        <View style={{
                            flexDirection: 'row',
                            marginTop: 35,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <Text style={styles.addFont}>Date: </Text>

                            <DatePicker
                                style={{ width: 230, height: 30, position: 'absolute', right: 11, marginTop: 3 }}
                                date={this.state.date}
                                mode="datetime"
                                placeholder="day/month hour"
                                format="DD MMMM YYYY h:mm a"
                                minDate={this.today.getFullYear() - 1 + '-' + parseInt(this.today.getMonth() + 1) + '-' + this.today.getDate()}
                                maxDate={this.today}
                                confirmBtnText="Confirm"
                                cancelBtnText="Cancel"
                                customStyles={{ dateIcon: { position: 'absolute', left: 0, top: 4 } }}
                                onDateChange={(date) => {
                                    let newDate = new Date(date);
                                    this.newActivity.date = newDate;
                                    // console.log(this.newActivity.date);
                                    this.setState({ date: date });
                                }} />

                        </View>

                    </View>


                </Card>

                {this.showActivities()}

            </ScrollView>
            </View>
        )
    }

    fetchActivities() {
        fetch('https://mysqlcs639.cs.wisc.edu/activities/', {
            method: 'GET',
            headers: { 'x-access-token': this.props.token, 'Content-Type': 'application/json' },
            redirect: 'follow'
        }).then(response => response.json()).then(result => {
            if (result.message) { Alert.alert(result.message); }
            else {
                this.setState({ userActivities: result.activities, isFirstTime: false });
            }
        });
    }

    showActivities() {
        var activityList = [];
        this.state.userActivities.forEach(activity => {
            if (!this.state.editActivity[activity.id]) {
                activityList.push(
                    <Card key={activity.id} style={{ height: 180, width: 400, backgroundColor: '#fff6e6', marginTop: 20, marginBottom: 10 }} >

                        <Button buttonStyle={{
                            alignItems: 'center', justifyContent: 'center',
                            width: 70, height: 70, position: 'absolute', zIndex: 1, top: -10, right: -10
                        }}
                            textStyle={{ fontSize: 25, color: '#ff5235' }} text={'✕'}
                            onPress={() => this.deleteActivity(activity.id)} />

                        <View style={{ padding: 20 }}>

                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ fontSize: 25 }}>{activity.name}</Text>
                            </View>

                            <View style={{ flexDirection: 'row', height: 25, top: 15 }}>
                                <Text style={{ fontSize: 20 }}>Calories: {activity.calories} cals</Text>
                                <Text style={{ marginLeft: 60, fontSize: 20 }}>{
                                    new Date(activity.date).getFullYear() + "/" +
                                    parseInt(new Date(activity.date).getMonth() + 1) + "/" +
                                    new Date(activity.date).getDate() + "  " +
                                    new Date(activity.date).getHours() + ":" +
                                    new Date(activity.date).getMinutes()}</Text>
                            </View>
                            {/* {console.log("hour: " + new Date(activity.date).getHours())} */}
                            <View style={{ flexDirection: 'row', marginTop: 30 }}>
                                <Text style={{ fontSize: 20 }}>Duration: {activity.duration} mins</Text>

                            </View>
                            <View style={{ marginTop: 10, alignItems: 'center', justifyContent: 'center' }}>
                                <Button buttonStyle={{ width: 45, height: 30, borderRadius: 3, borderWidth: 1, borderColor: '#ffc04f', alignItems: 'center', justifyContent: 'center' }}
                                    textStyle={{ color: '#ffc04f', fontSize: 20 }}
                                    text={'Edit'} onPress={() => this.editActivity(activity.id)} />
                            </View>
                        </View>
                    </Card>
                )
            } else {

                // { console.log(activity.name) }
                activityList.push(
                    <Card key={activity.id} style={{ height: 180, width: 400, backgroundColor: '#fff6e6', marginTop: 20, marginBottom: 10 }} >

                        <Button buttonStyle={{
                            alignItems: 'center', justifyContent: 'center',
                            width: 70, height: 70, position: 'absolute', zIndex: 1, top: -10, right: -10
                        }}
                            textStyle={{ fontSize: 25, color: '#ff5235' }} text={'✕'}
                            onPress={() => this.deleteActivity(activity.id)} />

                        <View style={{ padding: 20 }}>

                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                <TextInput style={{ fontSize: 25 }}
                                    placeholder={activity.name}
                                    onChangeText={(text) => this.editList[activity.id].name = text}>
                                </TextInput>
                            </View>

                            <View style={{ flexDirection: 'row', height: 25, top: 15 }}>
                                <Text style={{ fontSize: 20 }}>Calories: </Text>
                                <TextInput style={{ fontSize: 20 }}
                                    placeholder={activity.calories.toString()}
                                    onChangeText={(text) => this.editList[activity.id].calories = text}>
                                </TextInput>
                                <Text style={{ fontSize: 20 }}> cals</Text>
                                <DatePicker
                                    style={{ marginTop: 10, position: 'absolute', right: 10 }}
                                    date={this.state.currDate}
                                    mode="datetime"
                                    placeholder={new Date(activity.date).getFullYear() + "/" +
                                        parseInt(new Date(activity.date).getMonth() + 1) + "/" +
                                        new Date(activity.date).getDate() + "  " +
                                        new Date(activity.date).getHours() + ":" +
                                        new Date(activity.date).getMinutes()}
                                    format="DD MMMM YYYY h:mm a"
                                    minDate={this.today.getFullYear() - 1 + '-' + parseInt(this.today.getMonth() + 1) + '-' + this.today.getDate()}
                                    maxDate={this.today}
                                    customStyles={{dateIcon: {display:'none'}, dateInput: {top: -10,left: 15}}}
                                    confirmBtnText="Confirm"
                                    cancelBtnText="Cancel"
                                    onDateChange={(date) => {
                                        let newDate = new Date(date);
                                        this.editList[activity.id].date = newDate;
                                        this.setState({ currDate: date });
                                    }} />
                            </View>
                            <View style={{ flexDirection: 'row', marginTop: 30 }}>
                                <Text style={{ fontSize: 20 }}>Duration: </Text>
                                <TextInput style={{ fontSize: 20 }}
                                    placeholder={activity.duration.toString()}
                                    onChangeText={(text) => this.editList[activity.id].duration = text}></TextInput>
                                <Text style={{ fontSize: 20 }}> mins</Text>
                            </View>
                            <View style={{ marginTop: 10, alignItems: 'center', justifyContent: 'center' }}>
                                <Button buttonStyle={{ width: 45, height: 30, borderRadius: 3, borderWidth: 1, borderColor: '#ffc04f', alignItems: 'center', justifyContent: 'center' }}
                                    textStyle={{ color: '#ffc04f', fontSize: 20 }}
                                    text={'Save'} onPress={() => this.saveActivity(activity.id)} />
                            </View>
                        </View>
                    </Card>
                )
            }
        })
        return activityList;
    }

    addActivity() {
        fetch('https://mysqlcs639.cs.wisc.edu/activities/', {
            method: 'POST',
            headers: { 'x-access-token': this.props.token, 'Content-Type': 'application/json' },
            body: JSON.stringify(this.newActivity),
            redirect: "follow"
        }).then(response => response.json()).then(result => {
            if (result.message) {
                Alert.alert(result.message);
                this.fetchActivities();
            }
        });
    }

    editActivity(id) {
        let editedActivity = JSON.parse(JSON.stringify(this.state.editActivity));
        editedActivity[id] = true;
        this.setState({ editActivity: editedActivity });
        this.editList[id] = {};
    }

    saveActivity(id) {
        fetch('https://mysqlcs639.cs.wisc.edu/activities/' + id, {
            method: 'PUT',
            headers: { 'x-access-token': this.props.token, 'Content-Type': 'application/json' },
            body: JSON.stringify(this.editList[id]),
            redirect: "follow"
        }).then(response => response.json()).then(result => {
            Alert.alert(result.message);
            this.fetchActivities();
        });
        let editedctivity = JSON.parse(JSON.stringify(this.state.editActivity));
        editedctivity[id] = false;
        this.setState({ editActivity: editedctivity });
    }

    deleteActivity(id) {
        fetch('https://mysqlcs639.cs.wisc.edu/activities/' + id, {
            method: 'DELETE',
            headers: { 'x-access-token': this.props.token, 'Content-Type': 'application/json' },
            redirect: "follow"
        }).then(response => response.json()).then(result => {
            if (result.message) {
                Alert.alert(result.message);
                this.fetchActivities();
            }
        });
    }
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#ffc04f',
        position: 'absolute',
        right: 10,
        marginTop: 10,
        width: 40,
        height: 40,
        borderRadius: 20
    },
    addFont: {
        fontSize: 23,
        position: 'absolute',
        left: 10
    },
    inputFont: {
        fontSize: 23,
        position: 'absolute',
        right: 10
    }
});

export default Activity;