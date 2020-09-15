import React, {useState} from 'react';
import {StyleSheet, View, ScrollView} from 'react-native';
import {Header, Loading} from '../../components/molecules';
import {Input, Button, Gap} from '../../components';
import {colors, useForm, storeData, showError} from '../../utils';
import {Fire} from '../../config';
import {showMessage, hideMessage} from 'react-native-flash-message';
import {useDispatch} from 'react-redux';

const Register = ({navigation}) => {
  // const [fullName, setFullName] = useState('');
  // const [profession, setProfession] = useState('');
  // const [email, setEmail] = useState('');
  // const [password, setPassword] = useState('');

  const [form, setForm] = useForm({
    fullName: '',
    profession: '',
    email: '',
    password: '',
  });

  const dispatch = useDispatch();

  const onContinue = () => {
    console.log(form);
    dispatch({type: 'SET_LOADING', value: true});
    Fire.auth()
      .createUserWithEmailAndPassword(form.email, form.password)
      .then((success) => {
        dispatch({type: 'SET_LOADING', value: false});
        setForm('reset');
        const data = {
          fullName: form.fullName,
          profession: form.profession,
          email: form.email,
          uid: success.user.uid,
        };

        Fire.database()
          .ref('users/' + success.user.uid + '/')
          .set(data);

        // getData('user').then((res) => {
        //   console.log('data: ', res);
        // });
        // proses penyimpanan ke local storage
        // user merupakan key dan form merupakan value
        storeData('user', data);
        // proses penyimpanan ke local storage
        navigation.navigate('UploadPhoto', data);
        console.log('register success', success);
      })
      .catch((error) => {
        const errorMessage = error.message;
        dispatch({type: 'SET_LOADING', value: false});
        showError(errorMessage);
        console.log('error: ', error);
      });
  };
  return (
    <>
      <View style={styles.page}>
        <Header onPress={() => navigation.goBack()} title="Daftar Akun" />
        <View style={styles.content}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Input
              label="Full Name"
              value={form.fullName}
              onChangeText={(value) => setForm('fullName', value)}
            />
            <Gap height={24} />
            <Input
              label="Pekerjaan"
              value={form.profession}
              onChangeText={(value) => setForm('profession', value)}
            />
            <Gap height={24} />
            <Input
              label="Email"
              value={form.email}
              onChangeText={(value) => setForm('email', value)}
            />
            <Gap height={24} />
            <Input
              label="Password"
              value={form.password}
              onChangeText={(value) => setForm('password', value)}
              secureTextEntry
            />
            <Gap height={40} />
            <Button title="Continue" onPress={onContinue} />
          </ScrollView>
        </View>
      </View>
    </>
  );
};

export default Register;

const styles = StyleSheet.create({
  page: {backgroundColor: colors.white, flex: 1},
  content: {
    padding: 40,
    paddingTop: 0,
  },
});
