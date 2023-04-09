import React from 'react';
import { StyleSheet, Text, View, Platform, ScrollView, Dimensions, Alert } from 'react-native';
import {
    // createBottomTabNavigator,
    // createStackNavigator,
    // DrawerNavigator,
    // HeaderNavigationBar,
    // StackNavigator,
    NavigationEvents,
    createAppContainer
} from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { Card } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import Button from './Button';
import Profile from './Profile';
import Activity from './Activity';
import Meal from './Meal';

class CurrDay extends React.Component {

    constructor(props) {
        super(props);
        this.today = new Date();
        this.state = {
            userInfo: this.props.screenProps.info,
            isFirstTime: true,
            userActivities: [],
            currDayActivities: [],
            userMeals: [],
            currDayMeals: [],
            totalNutrition: { total: { calories: 0, carbohydrates: 0, protein: 0, fat: 0 } },
            date: new Date()
        }
    }

    static navigationOptions = {
        title: 'Current Day',
        tabBarIcon: ({ tintColor }) => (
            <Ionicons name={Platform.OS === "ios" ? "ios-today" : "md-today"} size={35} color={tintColor} style={{ top: 5 }} />
        )
    };
    render() {
        const screenWidth = Math.round(Dimensions.get('window').width);
        if (this.state.isFirstTime) { this.fetchData(); }

        return (
            <View style={{ flex: 1, backgroundColor: '#ffefd2' }}>
                <ScrollView contentContainerStyle={{ alignItems: 'center', backgroundColor: '#ffefd2' }}>

                    <NavigationEvents onDidFocus={() => this.fetchData()} />


                    <View style={{
                        flexDirection: 'row',
                        width: screenWidth,
                        marginTop: 15,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Ionicons name={Platform.OS === "ios" ? "ios-arrow-dropleft" : "md-arrow-dropleft"}
                            size={30} style={{ margin: 8, marginRight: 40, textAlign: 'center' }}
                            onPress={() => this.prevDay()} />

                        <Text style={{ fontSize: 25 }}>
                            {this.state.date.getDate() === this.today.getDate() ? "Today's Summary" : moment(this.state.date).format("MMM Do YY")}
                        </Text>

                        <Ionicons name={Platform.OS === "ios" ? "ios-arrow-dropright" : "md-arrow-dropright"}
                            size={30} style={{ margin: 8, marginLeft: 40, textAlign: 'center' }}
                            onPress={() => this.nextDay()} />
                    </View>


                    <Card style={{ height: 380, width: 400, marginTop: 10, backgroundColor: '#fff6e6' }}>
                        <View style={{
                            flexDirection: 'row',
                            width: screenWidth,
                            marginTop: 10,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <Text style={{ fontSize: 20 }}> Nutritions </Text>
                            <Text style={{ fontSize: 15 }}> / (Daily Goal)</Text>
                        </View>

                        <View style={styles.column}>
                            <Text style={{ fontSize: 25, color: '#4d3200' }}> Calories: </Text>
                            <Text style={styles.info}>{this.state.totalNutrition.total.calories} / ({this.state.userInfo.goalDailyCalories})</Text>
                        </View>

                        <View style={styles.column}>
                            <Text style={{ fontSize: 25, color: '#4d3200' }}> Carbohydrates: </Text>
                            <Text style={styles.info}>{this.state.totalNutrition.total.carbohydrates} / ({this.state.userInfo.goalDailyCarbohydrates})</Text>
                        </View>

                        <View style={styles.column}>
                            <Text style={{ fontSize: 25, color: '#4d3200' }}> Fat: </Text>
                            <Text style={styles.info}>{this.state.totalNutrition.total.fat} / ({this.state.userInfo.goalDailyFat})</Text>
                        </View>

                        <View style={styles.column}>
                            <Text style={{ fontSize: 25, color: '#4d3200' }}> Protein: </Text>
                            <Text style={styles.info}>{this.state.totalNutrition.total.protein} / ({this.state.userInfo.goalDailyProtein})</Text>
                        </View>

                        <View style={styles.column}></View>

                        <View style={{
                            flexDirection: 'row',
                            width: screenWidth,
                            marginTop: 10,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <Text style={{ fontSize: 20 }}> Activity Achievements </Text>
                            <Text style={{ fontSize: 15 }}> / (Daily Goal)</Text>
                        </View>

                        <View style={styles.column}>
                            <Text style={{ fontSize: 25, color: '#4d3200' }}> Duration: </Text>
                            <Text style={styles.info}>{this.getTotalDuration()} / ({this.state.userInfo.goalDailyActivity})</Text>
                        </View>

                    </Card>

                    <View style={{
                        flexDirection: 'row',
                        width: screenWidth,
                        marginTop: 15,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Text style={{ fontSize: 25 }}> Activities </Text>
                    </View>

                    {this.showActivities()}

                    <View style={{
                        flexDirection: 'row',
                        width: screenWidth,
                        marginTop: 15,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Text style={{ fontSize: 25 }}> Meals </Text>
                    </View>
                    {this.showMeals()}

                </ScrollView>
            </View>
        )
    }

    prevDay() {
        if (this.today.getDate() - this.state.date.getDate() <= 6) {
            this.setState({ date: new Date(this.state.date.setDate(this.state.date.getDate() - 1)) });
        }
        this.fetchData();
    }

    nextDay() {
        if (this.today.getDate() - this.state.date.getDate() >= 1) {
            this.setState({ date: new Date(this.state.date.setDate(this.state.date.getDate() + 1)) });
        }
        this.fetchData();
    }

    getTotalDuration() {
        var time = 0;
        this.state.currDayActivities.forEach(activity => { time += activity.duration; })
        return time;
    }

    showActivities() {
        var activityList = [];
        if (this.state.currDayActivities.length == 0) {
            return (<View style={{ alignItems: 'center', justifyContent: 'center', }}><Text> (no activities today!)</Text></View>);
        }
        this.state.currDayActivities.forEach(activity => {
            activityList.push(
                <Card key={activity.id} style={{ marginTop: 10, width: 400, backgroundColor: '#fff6e6' }}>
                    <View style={{ padding: 10 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontSize: 25 }}>{activity.name}</Text>
                        </View>

                        <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row', height: 25, marginTop: 10 }}>
                            <Text style={{ fontSize: 15 }}>{
                                new Date(activity.date).getFullYear() + "/" +
                                parseInt(new Date(activity.date).getMonth() + 1) + "/" +
                                new Date(activity.date).getDate() + "  " +
                                new Date(activity.date).getHours() + ":" +
                                new Date(activity.date).getMinutes()}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', marginTop: 10 }}>
                            <Text style={{ fontSize: 20 }}>Calories: {activity.calories} cals</Text>
                            <Text style={{ fontSize: 20, position: 'absolute', right: 5 }}>Duration: {activity.duration} mins</Text>

                        </View>
                    </View>
                </Card>
            );
        })
        return activityList;
    }

    showMeals() {
        var mealList = [];
        if (this.state.currDayMeals.length == 0) {
            return (<View style={{ alignItems: 'center', justifyContent: 'center', }}><Text> (no meals today!)</Text></View>);
        }
        this.state.currDayMeals.forEach(meal => {
            mealList.push(
                <Card key={meal.id} style={{ marginTop: 10, width: 400, backgroundColor: '#fff6e6' }}>
                    <View style={{ padding: 10 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontSize: 25 }}>{meal.name}</Text>
                        </View>

                        <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row', height: 25, marginTop: 10 }}>
                            <Text style={{ fontSize: 15 }}>{
                                new Date(meal.date).getFullYear() + "/" +
                                parseInt(new Date(meal.date).getMonth() + 1) + "/" +
                                new Date(meal.date).getDate() + "  " +
                                new Date(meal.date).getHours() + ":" +
                                new Date(meal.date).getMinutes()}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', marginTop: 10 }}>
                            <Text style={{ fontSize: 20 }}>Calories: {this.state.totalNutrition[meal.id] === undefined ? 0 : this.state.totalNutrition[meal.id].calories} cals</Text>
                            <Text style={{ fontSize: 20, position: 'absolute', right: 5 }}>Protein: {this.state.totalNutrition[meal.id] === undefined ? 0 : this.state.totalNutrition[meal.id].protein}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', marginTop: 10 }}>
                            <Text style={{ fontSize: 20 }}>Carbohydrates: {this.state.totalNutrition[meal.id] === undefined ? 0 : this.state.totalNutrition[meal.id].carbohydrates}</Text>
                            <Text style={{ fontSize: 20, position: 'absolute', right: 5 }}>fat: {this.state.totalNutrition[meal.id] === undefined ? 0 : this.state.totalNutrition[meal.id].fat}</Text>
                        </View>
                    </View>
                </Card>
            );
        })
        return mealList;
    }

    fetchData() {

        fetch('https://mysqlcs639.cs.wisc.edu/users/' + this.props.screenProps.username, {
            method: 'GET',
            headers: { 'x-access-token': this.props.screenProps.token },
            redirect: 'follow'
        }).then(response_0 => response_0.json()).then(info => {
            if (info.message) {
                Alert.alert(info.message);
            }
            this.setState({ userInfo: info });

        })

        fetch('https://mysqlcs639.cs.wisc.edu/activities/', {
            method: 'GET',
            headers: { 'x-access-token': this.props.screenProps.token, 'Content-Type': 'application/json' },
            redirect: 'follow'
        }).then(response_1 => response_1.json()).then(result_1 => {
            if (result_1.message) { Alert.alert(result_1.message); }
            else {
                let todayActivities = this.getTodayActivities(result_1.activities);
                this.setState({ userActivities: result_1.activities, currDayActivities: todayActivities, isFirstTime: false });
            }
        });


        fetch('https://mysqlcs639.cs.wisc.edu/meals/', {
            method: 'GET',
            headers: { 'x-access-token': this.props.screenProps.token, 'Content-Type': 'application/json' },
            redirect: 'follow'
        }).then(response_2 => response_2.json()).then(result_2 => {
            if (result_2.message) { Alert.alert(result_2.message); }
            else {
                let todayMeals = this.getTodayMeals(result_2.meals);
                this.setState({ userMeals: result_2.meals, currDayMeals: todayMeals, isFirstTime: false });
            }
        }).then(() => { this.calculateNutrition() });
    }

    calculateNutrition() {
        var totalCalories = 0;
        var totalProtein = 0;
        var totalCarbohydrates = 0;
        var totalFat = 0;

        this.state.currDayMeals.forEach(meal => {

            fetch('https://mysqlcs639.cs.wisc.edu/meals/' + meal.id + '/foods', {
                method: 'GET',
                headers: { 'x-access-token': this.props.screenProps.token, 'Content-Type': 'application/json' },
                redirect: 'follow'
            }).then(response => response.json()).then(result => {
                if (result.message) { Alert.alert(result.message); }
                else {

                    var mealCalories = 0;
                    var mealProtein = 0;
                    var mealCarbohydrates = 0;
                    var mealFat = 0;

                    result.foods.forEach(food => {
                        mealCalories += food.calories;
                        mealProtein += food.protein;
                        mealCarbohydrates += food.carbohydrates;
                        mealFat += food.fat;
                    })
                    totalCalories += mealCalories;
                    totalProtein += mealProtein;
                    totalCarbohydrates += mealCarbohydrates;
                    totalFat += mealFat;

                    this.setState(prevState => ({
                        totalNutrition: {
                            ...prevState.totalNutrition, [meal.id]: { calories: mealCalories, protein: mealProtein, carbohydrates: mealCarbohydrates, fat: mealFat },
                            total: { calories: totalCalories, protein: totalProtein, carbohydrates: totalCarbohydrates, fat: totalFat }
                        }

                    }))
                }
            });
        })

    }

    getTodayMeals(meals) {
        var todayMeals = [];
        meals.forEach(meal => {
            var currDay = new Date(meal.date);
            if (currDay.getFullYear() === this.state.date.getFullYear() &&
                parseInt(currDay.getMonth()) === parseInt(this.state.date.getMonth()) &&
                currDay.getDate() === this.state.date.getDate()) {

                todayMeals.push(JSON.parse(JSON.stringify(meal)));
            }
        });
        return todayMeals;
    }

    getTodayActivities(activities) {
        var todayActivities = [];
        activities.forEach(activity => {
            var currDay = new Date(activity.date);
            if (currDay.getFullYear() === this.state.date.getFullYear() &&
                parseInt(currDay.getMonth()) === parseInt(this.state.date.getMonth()) &&
                currDay.getDate() === this.state.date.getDate()) {

                todayActivities.push(JSON.parse(JSON.stringify(activity)));
            }
        });
        return todayActivities;
    }
}

class ProfilePage extends React.Component {
    static navigationOptions = {
        title: 'Profile',
        tabBarIcon: ({ tintColor }) => (
            <Ionicons name={Platform.OS === "ios" ? "ios-person" : "md-person"} size={35} color={tintColor} style={{ top: 5 }} />
        )
    };
    render() {
        return (
            <Profile
                token={this.props.screenProps.token}
                info={this.props.screenProps.info}
                username={this.props.screenProps.username}
                password={this.props.screenProps.password}
                callBackLogOut={this.props.screenProps.callBackLogOut} />
        );
    }
}

class ActivityPage extends React.Component {
    static navigationOptions = {
        title: 'Activity',
        tabBarIcon: ({ tintColor }) => (
            <Ionicons name={Platform.OS === "ios" ? "ios-bicycle" : "md-bicycle"} size={35} color={tintColor} style={{ top: 5 }} />
        )
    };
    render() {
        return (
            <Activity
                token={this.props.screenProps.token}
                password={this.props.screenProps.password}
                callBackLogOut={this.props.screenProps.callBackLogOut} />
        );
    }
}

class MealPage extends React.Component {
    static navigationOptions = {
        title: 'Meal',
        tabBarIcon: ({ tintColor }) => (
            <Ionicons name={Platform.OS === "ios" ? "ios-restaurant" : "md-restaurant"} size={35} color={tintColor} style={{ top: 5 }} />
        )
    };
    render() {
        return (
            <Meal
                token={this.props.screenProps.token}
                password={this.props.screenProps.password}
                callBackLogOut={this.props.screenProps.callBackLogOut} />
        );
    }
}

const styles = StyleSheet.create({
    info: {
        fontSize: 25,
        position: 'absolute',
        right: 10
    },
    column: {
        flexDirection: 'row',
        marginLeft: 10,
        marginTop: 20,
        alignItems: 'center'
    }

});

const bottomNav = createBottomTabNavigator(
    {
        "Today": CurrDay,
        "Profile": ProfilePage,
        "Activity": ActivityPage,
        "Meal": MealPage
    },
    {
        navigationOptions: ({}),
        tabBarOptions: {
            activeTintColor: '#81968f',
            inactiveTintColor: 'white',
            style: { backgroundColor: "#ffcc70" },
            labelStyle: { fontSize: 18, top: 10 }
        },

        animationEnabled: true,
    }
);

export default createAppContainer(

    createStackNavigator({
        MyTab: {
            screen: bottomNav,
            navigationOptions: (props) => ({
                title: "Hi, " + props.screenProps.info.username,
                headerTitleStyle: {
                    fontSize: 25
                },
                headerStyle: { backgroundColor: "#ffcc70" },
                headerRight: <Button buttonStyle={{ color: '#ffffff', alignItems: 'center', justifyContent: 'center', marginRight: 10 }}
                    textStyle={{ color: '#ff5235', fontSize: 20 }}
                    text={'Log out'} onPress={() => props.screenProps.callBackLogOut()} />,
                headerTintColor: 'white'
            })
        }
    })
);