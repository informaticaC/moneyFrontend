// web 83523683186-8bkf72s0295k3jq9upke9hep30a28ub5.apps.googleusercontent.com
// ios 83523683186-acfsse1jd9sq1pu7fp9egn3huufmgjte.apps.googleusercontent.com
// android 83523683186-k0o3j3cjd1ch3ucl279omcp4hk0pr4jr.apps.googleusercontent.com
import * as React from 'react'
import { StatusBar } from 'expo-status-bar'
import { Button, Image, StyleSheet, Text, View } from 'react-native'
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import HomePage from '../screens/HomePage';


WebBrowser.maybeCompleteAuthSession();


const GoogleLogin = () => {
	console.log("Estoy en GoogleLogin!!");
	const navigation = useNavigation();

	const [userInfo, setUserInfo] = React.useState(null);
	const [request, response, promptAsync] = Google.useAuthRequest({
		androidClientId: "83523683186-k0o3j3cjd1ch3ucl279omcp4hk0pr4jr.apps.googleusercontent.com",
		iosClientId: "83523683186-acfsse1jd9sq1pu7fp9egn3huufmgjte.apps.googleusercontent.com",
		webClientId: "83523683186-8bkf72s0295k3jq9upke9hep30a28ub5.apps.googleusercontent.com"
	});
	const [userData, setuserData] = React.useState({});
	// const [userData, setuserData] = React.useState({
	// 	firstname: null,
	// 	lastname: null,
	// 	phone: null,
	// 	email: null,
	// 	password:null,
	// 	role:null
	//   });

	React.useEffect(() => {

	   handleSignInWithGoogle();

	  	  
	}, [response])

	React.useEffect(()=>{
		console.log("userInfo: => ");
		userInfo? console.log(userInfo) : console.log("Not data yet :( :(");

		setuserData({
			firstname: userInfo?.given_name,
			lastname:userInfo?.family_name,
			phone:null,
			email:userInfo?.email,
			password:null,
			image: userInfo?.picture,
			role:null
		});
		console.log(userData);
		if (userData.firstname) {
			console.log("intentando registro")	
			handleRegister();
		}else{
			console.log("there are not data in userData :(");
		}
	},[userInfo])
	
	async function handleSignInWithGoogle(){
		const user = await AsyncStorage.getItem("@user");
		if (!user) {
			if(response?.type === "success") {
				getUserInfo(response.authentication.accessToken);
				console.log(response.authentication.accessToken);
			}
		} else {
			setUserInfo(JSON.parse(user));
		}
	}
	
	function getUserInfo(token) {
		const url="https://www.googleapis.com/userinfo/v2/me";
		if(!token) return;
		
		try{
			axios.get(url, {headers: {Authorization: `Bearer ${token}`}})
			.then((res) => {
				setUserInfo(res.data);
				AsyncStorage.setItem("@user", JSON.stringify(res.data));
			})          
			.catch((err)=> console.log(err));
		} catch (error){
			console.log(error);
		}
	};
	
	const ShowUserInfo = ({user})=>{
		//console.log(user);
		// setuserData({firstname : user?.given_name})
		
		return(
			<View style={styles.container}>
				<Text style={styles.text}>Name: {user.name}</Text>
				<Text style={styles.text}>Email: {user?.email}</Text>
				<Image source={{uri: user?.picture}} style={{width:100, height:100, borderRadius: 50}} />
			</View>
		)
	}

// email:"pesoa01@gmail.com"
// family_name:"Pesoa"
// given_name:"Gabriel"
// id:"105276583625764935999"
// locale:"es-419"
// name:"Gabriel Pesoa"
// picture:"https://lh3"

	// const handleInputChange = (key, value) => {
	// 	setuserData({
	// 	  ...userData,
	// 	  [key]: value,
	// 	});
	//   };	
	
	const handleRegister = () => {
		console.log(userData)
		  const url ="http://localhost:8080/api/v1/users";
		  axios.post(url, userData)
			.then(res => console.log(res.data))
			.catch(err => console.log(err))
		};
	
  return (
    <View style={styles.container}>
        <Text>GoogleLogin</Text>
		<Button title='Sign in with Google' onPress={() => promptAsync()}>Sign in</Button>
		{
			
			// userInfo? navigation.navigate("HomePage")  : <Text>"Not logued yet"</Text>
			userInfo? <ShowUserInfo user={userInfo} /> : <Text>"Not logued yet"</Text>
			
		}
        <StatusBar style='auto'/>
		<Button title='Log out' onPress={() => AsyncStorage.removeItem("@user")}>Log off</Button>
		
    </View>

  );
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
	text: {
		color: "black",
	}
});

export default GoogleLogin