import React from 'react';
import { StyleSheet, TextInput, Text, View, KeyboardAvoidingView, ScrollView, Dimensions, Alert } from 'react-native';
import { Card } from 'react-native-paper';
import DatePicker from 'react-native-datepicker'
import Button from './Button';
import base64 from 'base-64';

class Meal extends React.Component {
    constructor(props) {
        super(props);
        this.newMeal = {};
        this.newFood = {};
        this.editMealList = {};
        this.editFoodList = {};
        this.today = new Date();
        this.state = {
            isFirstTime: true,
            isRefetchingFood: [],
            userMeal: [],
            editMeal: {},
            userFood: [],
            editFood: {},
            showFood: {}
        }
    }

    render() {
        if (this.state.isFirstTime) { this.fetchMeals() }
        // {console.log("rendering")}
        return (
            <View style={{ flex: 1, backgroundColor: '#ffefd2' }}>
                <ScrollView contentContainerStyle={{ alignItems: 'center', backgroundColor: '#ffefd2' }}>

                    <Card style={{ width: 400, height: 170, marginTop: 30, backgroundColor: '#fff6e6' }}>

                        <View style={{
                            flexDirection: 'row',
                            marginTop: 10,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <Text style={{ fontSize: 30 }}>Add New Meal</Text>
                        </View>


                        <Button buttonStyle={styles.button}
                            textStyle={{ color: '#ffffff', fontSize: 30, marginLeft: 11 }}
                            text={'+'} onPress={() => this.addMeal()} />


                        <View style={{ marginTop: 15 }}>

                            <View style={{
                                flexDirection: 'row',
                                marginTop: 15,
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                <Text style={styles.addFont}>Meal Name: </Text>

                                <TextInput style={styles.inputFont} placeholder='enter meal name' onChangeText={(text) => this.newMeal.name = text}></TextInput>
                            </View>

                            <View style={{
                                flexDirection: 'row',
                                marginTop: 50,
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
                                        this.newMeal.date = newDate;
                                        // console.log(this.newMeal.date);
                                        this.setState({ date: date });
                                    }} />

                            </View>

                        </View>

                    </Card>

                    {this.showMeals()}

                </ScrollView>
            </View>
        )
    }

    fetchMeals() {
        fetch('https://mysqlcs639.cs.wisc.edu/meals/', {
            method: 'GET',
            headers: { 'x-access-token': this.props.token, 'Content-Type': 'application/json' },
            redirect: 'follow'
        }).then(response => response.json()).then(result => {
            if (result.message) { Alert.alert(result.message); }
            else {
                this.setState({ userMeal: result.meals, isFirstTime: false });
            }
        });
    }

    fetchFood(id) {
        fetch('https://mysqlcs639.cs.wisc.edu/meals/' + id + '/foods', {
            method: 'GET',
            headers: { 'x-access-token': this.props.token, 'Content-Type': 'application/json' },
            redirect: 'follow'
        }).then(response_1 => response_1.json()).then(result_1 => {
            if (result_1.message) { Alert.alert(result_1.message); }
            else {
                this.setState(prevState => ({ userFood: result_1.foods, isRefetchingFood: { ...prevState.isRefetchingFood, [id]: true } }));
            }
        });
    }

    showMeals() {
        var mealList = [];
        // console.log("here");
        this.state.userMeal.forEach(meal => {
            if (!this.state.editMeal[meal.id]) {
                mealList.push(
                    <Card key={meal.id} style={{ height: 150, width: 400, backgroundColor: '#fff6e6', marginTop: 40, marginBottom: 10 }} >

                        <Button buttonStyle={{
                            alignItems: 'center', justifyContent: 'center',
                            width: 70, height: 70, position: 'absolute', zIndex: 1, top: -10, right: -10
                        }}
                            textStyle={{ fontSize: 25, color: '#ff5235' }} text={'✕'}
                            onPress={() => this.deleteMeal(meal.id)} />

                        <View style={{ padding: 20 }}>

                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ fontSize: 25 }}>{meal.name}</Text>
                            </View>

                            <View style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row', height: 25, top: 10 }}>
                                <Text style={{ fontSize: 20 }}>{
                                    new Date(meal.date).getFullYear() + "/" +
                                    parseInt(new Date(meal.date).getMonth() + 1) + "/" +
                                    new Date(meal.date).getDate() + "  " +
                                    new Date(meal.date).getHours() + ":" +
                                    new Date(meal.date).getMinutes()}</Text>
                            </View>

                            <View style={{ marginTop: 30 }}>
                                <Button buttonStyle={{ marginLeft: 30, width: 90, height: 30, borderRadius: 3, borderWidth: 1, borderColor: '#ffc04f', alignItems: 'center', justifyContent: 'center' }}
                                    textStyle={{ color: '#ffc04f', fontSize: 20 }}
                                    text={this.state.showFood[meal.id] ? 'Hide' : 'Details'}
                                    onPress={() => this.setState(prevState => ({ showFood: { ...prevState.showFood, [meal.id]: !prevState.showFood[meal.id] } }))} />
                                <Button buttonStyle={{ position: 'absolute', right: 30, width: 90, height: 30, borderRadius: 3, borderWidth: 1, borderColor: '#ffc04f', alignItems: 'center', justifyContent: 'center' }}
                                    textStyle={{ color: '#ffc04f', fontSize: 20 }}
                                    text={'Edit Meal'} onPress={() => this.editMeal(meal.id)} />
                            </View>
                        </View>
                    </Card>
                )
                if (this.state.showFood[meal.id]) {
                    mealList.push(this.addFoodCard(meal.id));
                    mealList.push(this.showFood(meal.id));
                }

            } else {

                mealList.push(
                    <Card key={meal.id} style={{ height: 150, width: 400, backgroundColor: '#fff6e6', marginTop: 40, marginBottom: 10 }} >

                        <Button buttonStyle={{
                            alignItems: 'center', justifyContent: 'center',
                            width: 70, height: 70, position: 'absolute', zIndex: 1, top: -10, right: -10
                        }}
                            textStyle={{ fontSize: 25, color: '#ff5235' }} text={'✕'}
                            onPress={() => this.deleteMeal(meal.id)} />

                        <View style={{ padding: 20 }}>

                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                <TextInput style={{ fontSize: 25 }}
                                    placeholder={meal.name}
                                    onChangeText={(text) => this.editMealList[meal.id].name = text}>
                                </TextInput>
                            </View>

                            <View style={{ flexDirection: 'row', height: 25, top: 15 }}>
                                <DatePicker
                                    style={{ marginTop: 8, position: 'absolute', right: 125 }}
                                    date={this.state.currDate}
                                    mode="datetime"
                                    placeholder={new Date(meal.date).getFullYear() + "/" +
                                        parseInt(new Date(meal.date).getMonth() + 1) + "/" +
                                        new Date(meal.date).getDate() + "  " +
                                        new Date(meal.date).getHours() + ":" +
                                        new Date(meal.date).getMinutes()}
                                    format="DD MMMM YYYY h:mm a"
                                    minDate={this.today.getFullYear() - 1 + '-' + parseInt(this.today.getMonth() + 1) + '-' + this.today.getDate()}
                                    maxDate={this.today}
                                    customStyles={{ dateIcon: { display: 'none' }, dateInput: { top: -10, left: 15 } }}
                                    confirmBtnText="Confirm"
                                    cancelBtnText="Cancel"
                                    onDateChange={(date) => {
                                        let newDate = new Date(date);
                                        this.editMealList[meal.id].date = newDate;
                                        this.setState({ currDate: date });
                                    }} />
                            </View>

                            <View style={{ marginTop: 40, alignItems: 'center', justifyContent: 'center' }}>
                                <Button buttonStyle={{ position: 'absolute', right: 30, width: 50, height: 30, borderRadius: 3, borderWidth: 1, borderColor: '#ffc04f', alignItems: 'center', justifyContent: 'center' }}
                                    textStyle={{ color: '#ffc04f', fontSize: 20 }}
                                    text={'Save'} onPress={() => this.saveMeal(meal.id)} />
                            </View>
                        </View>

                    </Card>
                )
                if (this.state.showFood[meal.id]) { mealList.push(this.addFoodCard(meal.id)); }
            }
        })
        return mealList;
    }

    addFoodCard(id) {
        return (
            <View key={id + 'food'} style={{ alignItems: 'center', backgroundColor: '#fff6e6', marginBottom: 10 }}>
                <Card style={{ width: 390, height: 240, backgroundColor: '#fff6e6' }}>

                    <View style={{
                        flexDirection: 'row',
                        marginTop: 10,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Text style={{ fontSize: 25 }}>Add New Food</Text>
                    </View>


                    <Button buttonStyle={styles.button}
                        textStyle={{ color: '#ffffff', fontSize: 30, marginLeft: 11 }}
                        text={'+'} onPress={() => this.addFood(id)} />


                    <View style={{ marginTop: 15 }}>

                        <View style={{
                            flexDirection: 'row',
                            marginTop: 15,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <Text style={styles.addFont}>Food Name: </Text>

                            <TextInput style={styles.inputFont} placeholder='enter food name' onChangeText={(text) => this.newFood.name = text}></TextInput>
                        </View>

                        <View style={{
                            flexDirection: 'row',
                            marginTop: 35,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <Text style={styles.addFont}>Calories: </Text>

                            <TextInput style={styles.inputFont} placeholder='enter calories' onChangeText={(text) => this.newFood.calories = parseFloat(text)}></TextInput>
                        </View>

                        <View style={{
                            flexDirection: 'row',
                            marginTop: 35,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <Text style={styles.addFont}>Protein: </Text>

                            <TextInput style={styles.inputFont} placeholder='enter protein' onChangeText={(text) => this.newFood.protein = parseFloat(text)}></TextInput>
                        </View>

                        <View style={{
                            flexDirection: 'row',
                            marginTop: 35,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <Text style={styles.addFont}>Carbohydrates: </Text>

                            <TextInput style={styles.inputFont} placeholder='enter carbohydrates' onChangeText={(text) => this.newFood.carbohydrates = parseFloat(text)}></TextInput>
                        </View>

                        <View style={{
                            flexDirection: 'row',
                            marginTop: 35,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <Text style={styles.addFont}>Fat: </Text>

                            <TextInput style={styles.inputFont} placeholder='enter fat' onChangeText={(text) => this.newFood.fat = parseFloat(text)}></TextInput>
                        </View>

                    </View>

                </Card>
            </View>
        )
    }

    showFood(id) {


        if (!this.state.isRefetchingFood[id]) { this.fetchFood(id); }

        var foodList = [];
        this.state.userFood.forEach(food => {
            if (!this.state.editFood[food.id]) {
                foodList.push(
                    <Card key={food.id} style={{ height: 180, width: 390, backgroundColor: '#fff6e6', marginBottom: 10 }} >

                        <Button buttonStyle={{
                            alignItems: 'center', justifyContent: 'center',
                            width: 70, height: 70, position: 'absolute', zIndex: 1, top: -10, right: -10
                        }}
                            textStyle={{ fontSize: 25, color: '#ff5235' }} text={'✕'}
                            onPress={() => this.deleteFood(id, food.id)} />

                        <View style={{ padding: 20 }}>

                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ fontSize: 25 }}>{food.name}</Text>
                            </View>

                            <View style={{ flexDirection: 'row', height: 25, top: 15 }}>
                                <Text style={{ fontSize: 20 }}>Calories: {food.calories} cals</Text>
                                <Text style={{ fontSize: 20, position: 'absolute', right: 0 }}>Protein: {food.protein}</Text>
                            </View>

                            <View style={{ flexDirection: 'row', height: 25, top: 25 }}>
                                <Text style={{ fontSize: 20 }}>Carbohydrates: {food.carbohydrates}</Text>
                                <Text style={{ fontSize: 20, position: 'absolute', right: 0 }}>Fat: {food.fat}</Text>
                            </View>

                            <View style={{ marginTop: 33, alignItems: 'center', justifyContent: 'center' }}>
                                <Button buttonStyle={{ width: 45, height: 30, borderRadius: 3, borderWidth: 1, borderColor: '#ffc04f', alignItems: 'center', justifyContent: 'center' }}
                                    textStyle={{ color: '#ffc04f', fontSize: 20 }}
                                    text={'Edit'} onPress={() => this.editFood(food.id)} />
                            </View>
                        </View>
                    </Card>
                )
            } else {
                foodList.push(
                    <Card key={food.id} style={{ height: 180, width: 390, backgroundColor: '#fff6e6', marginBottom: 10 }} >

                        <Button buttonStyle={{
                            alignItems: 'center', justifyContent: 'center',
                            width: 70, height: 70, position: 'absolute', zIndex: 1, top: -10, right: -10
                        }}
                            textStyle={{ fontSize: 25, color: '#ff5235' }} text={'✕'}
                            onPress={() => this.deleteFood(id, food.id)} />

                        <View style={{ padding: 20 }}>

                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                <TextInput style={{ fontSize: 25 }}
                                    placeholder={food.name}
                                    onChangeText={(text) => this.editFoodList[food.id].name = text}>
                                </TextInput>
                            </View>


                            <View style={{ flexDirection: 'row', height: 25, top: 15 }}>
                                <Text style={{ fontSize: 20 }}>Calories: </Text>
                                <TextInput style={{ fontSize: 20 }}
                                    placeholder={food.calories.toString()}
                                    onChangeText={(text) => this.editFoodList[food.id].calories = text}>
                                </TextInput>
                                <Text style={{ fontSize: 20 }}> cals</Text>

                                <Text style={{ fontSize: 20, position: 'absolute', right: 30 }}>Protein: </Text>
                                <TextInput style={{ fontSize: 20, position: 'absolute', right: 0 }}
                                    placeholder={food.protein.toString()}
                                    onChangeText={(text) => this.editFoodList[food.id].protein = text}>
                                </TextInput>
                            </View>

                            <View style={{ flexDirection: 'row', height: 25, top: 25 }}>
                                <Text style={{ fontSize: 20 }}>Carbohydrates: </Text>
                                <TextInput style={{ fontSize: 20 }}
                                    placeholder={food.carbohydrates.toString()}
                                    onChangeText={(text) => this.editFoodList[food.id].carbohydrates = text}>
                                </TextInput>

                                <Text style={{ fontSize: 20, position: 'absolute', right: 30 }}>Fat: </Text>
                                <TextInput style={{ fontSize: 20, position: 'absolute', right: 0 }}
                                    placeholder={food.fat.toString()}
                                    onChangeText={(text) => this.editFoodList[food.id].fat = text}>
                                </TextInput>
                            </View>

                            <View style={{ marginTop: 33, alignItems: 'center', justifyContent: 'center' }}>
                                <Button buttonStyle={{ width: 45, height: 30, borderRadius: 3, borderWidth: 1, borderColor: '#ffc04f', alignItems: 'center', justifyContent: 'center' }}
                                    textStyle={{ color: '#ffc04f', fontSize: 20 }}
                                    text={'Save'} onPress={() => this.saveFood(id, food.id)} />
                            </View>
                        </View>
                    </Card>
                )
            }
        })
        return foodList;
    }

    addMeal() {
        fetch('https://mysqlcs639.cs.wisc.edu/meals/', {
            method: 'POST',
            headers: { 'x-access-token': this.props.token, 'Content-Type': 'application/json' },
            body: JSON.stringify(this.newMeal),
            redirect: "follow"
        }).then(response => response.json()).then(result => {
            if (result.message) {
                Alert.alert(result.message);
                this.fetchMeals();
            }
        });
    }

    addFood(id) {
        fetch('https://mysqlcs639.cs.wisc.edu/meals/' + id + '/foods/', {
            method: 'POST',
            headers: { 'x-access-token': this.props.token, 'Content-Type': 'application/json' },
            body: JSON.stringify(this.newFood),
            redirect: "follow"
        }).then(response => response.json()).then(result => {
            if (result.message) {
                Alert.alert(result.message);
                this.fetchFood();
            }
        });
    }

    editMeal(id) {
        let editedMeal = JSON.parse(JSON.stringify(this.state.editMeal));
        editedMeal[id] = true;
        this.setState({ editMeal: editedMeal });
        this.editMealList[id] = {};
    }

    editFood(id) {
        let editedFood = JSON.parse(JSON.stringify(this.state.editFood));
        editedFood[id] = true;
        this.setState({ editFood: editedFood });
        this.editFoodList[id] = {};
    }

    saveMeal(id) {
        fetch('https://mysqlcs639.cs.wisc.edu/meals/' + id, {
            method: 'PUT',
            headers: { 'x-access-token': this.props.token, 'Content-Type': 'application/json' },
            body: JSON.stringify(this.editMealList[id]),
            redirect: "follow"
        }).then(response => response.json()).then(result => {
            Alert.alert(result.message);
            this.fetchMeals();
        });
        let editedMeal = JSON.parse(JSON.stringify(this.state.editMeal));
        editedMeal[id] = false;
        this.setState({ editMeal: editedMeal });
    }

    saveFood(meal_id, food_id) {
        fetch('https://mysqlcs639.cs.wisc.edu/meals/' + meal_id + '/foods/' + food_id, {
            method: 'PUT',
            headers: { 'x-access-token': this.props.token, 'Content-Type': 'application/json' },
            body: JSON.stringify(this.editFoodList[food_id]),
            redirect: "follow"
        }).then(response => response.json()).then(result => {
            Alert.alert(result.message);
            this.fetchFood(meal_id);
        });
        let editedFood = JSON.parse(JSON.stringify(this.state.editFood));
        editedFood[food_id] = false;
        this.setState({ editFood: editedFood });
    }

    deleteMeal(id) {
        fetch('https://mysqlcs639.cs.wisc.edu/meals/' + id, {
            method: 'DELETE',
            headers: { 'x-access-token': this.props.token, 'Content-Type': 'application/json' },
            redirect: "follow"
        }).then(response => response.json()).then(result => {
            if (result.message) {
                Alert.alert(result.message);
                this.fetchMeals();
            }
        });
    }

    deleteFood(meal_id, food_id) {
        fetch('https://mysqlcs639.cs.wisc.edu/meals/' + meal_id + '/foods/' + food_id, {
            method: 'DELETE',
            headers: { 'x-access-token': this.props.token, 'Content-Type': 'application/json' },
            redirect: "follow"
        }).then(response => response.json()).then(result => {
            if (result.message) {
                Alert.alert(result.message);
                this.fetchFood(meal_id);
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

export default Meal;