import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomePage = () => {
  // console.log('UserInfo:',user);
  // if (user) {
  //   console.log(user);
  // }

  const navigation = useNavigation();
  const [user, setUser] = React.useState(null);
  const [userStored, setUserStored] = React.useState(null);

  async function isLogged(){
		setUserStored(await AsyncStorage.getItem("@user"));
		if (userStored) {
				setUser(JSON.parse(userStored));
			}
	}

	React.useEffect(() => {
    isLogged();
  }, [userStored]);

  console.log('user:', user);

  const ShowUserInfo = ({user})=>{
		console.log(user);
		// setuserData({firstname : user?.given_name})
		return(
			<View style={styles.container}>
				<Text style={styles.text}>Name: {user.name}</Text>
				<Text style={styles.text}>Email: {user?.email}</Text>
				<Image source={{uri: user?.picture}} style={{width:100, height:100, borderRadius: 50}} />
			</View>
		)
	}
    
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>¡Bienvenido a Finanza Personal!</Text>
      {
        user? <ShowUserInfo user={user} /> : <Text>"Not logued yet"</Text>
      }
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('LoginScreen')}
          // Aquí puedes navegar a la pantalla de inicio de sesión
      >
        <Text style={styles.buttonText}>Iniciar Sesión</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('RegisterScreen')}
          // Aquí puedes navegar a la pantalla de registro
      >
        <Text style={styles.buttonText}>Registrarse</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
    button: {
      backgroundColor: '#007bff', // Color de fondo
      borderRadius: 5, // Bordes redondeados
      padding: 10, // Relleno interno
      marginTop: 10, // Margen superior
      width: '80%', // Ancho del botón
      alignItems: 'center', // Alinear contenido al centro horizontalmente
    },
    buttonText: {
      color: '#fff', // Color del texto
      fontSize: 16, // Tamaño de fuente
      fontWeight: 'bold', // Peso de fuente en negrita
    },
  });

export default HomePage;
