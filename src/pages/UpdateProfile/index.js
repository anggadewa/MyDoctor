import React, {useState, useEffect} from 'react';
import {StyleSheet, View, ScrollView} from 'react-native';
import {Header, Profile, Input, Button, Gap} from '../../components';
import {colors, getData, storeData, showError} from '../../utils';
import {Fire} from '../../config';
import ImagePicker from 'react-native-image-picker';
import {ILNullPhoto} from '../../assets';

const UpdateProfile = ({navigation}) => {
  const [profile, setProfile] = useState({
    fullName: '',
    profession: '',
    email: '',
    photoForDB: '',
  });
  const [password, setPassword] = useState('');
  const [photo, setPhoto] = useState(ILNullPhoto);
  // const [photoForDB, setPhotoForDB] = useState('');

  useEffect(() => {
    getData('user').then((res) => {
      // const data = res;
      // data.photoForDB = res?.photo?.length > 1 ? res.photo : ILNullPhoto;
      // const tempPhoto = res?.photo?.length > 1 ? {uri: res.photo} : ILNullPhoto;
      // setPhoto(tempPhoto);
      // setProfile(data);

      const data = res;
      data.photoForDB = res?.photo?.length > 1 ? res.photo : ILNullPhoto;
      const tempPhoto = res?.photo?.length > 1 ? {uri: res.photo} : ILNullPhoto;
      setPhoto(tempPhoto);
      setProfile(data);
    });
  }, []);

  const update = () => {
    console.log('profile: ', profile);
    console.log('new password: ', password);

    if (password.length > 0) {
      if (password.length < 6) {
        showError('Password Kurang dari 6 Karakter');
      } else {
        // update password
        updatePassword();
        updateProfileData();
        navigation.replace('MainApp');
      }
    } else {
      updateProfileData();
      navigation.replace('MainApp');
    }
  };

  const updatePassword = () => {
    Fire.auth().onAuthStateChanged((user) => {
      if (user) {
        user.updatePassword(password).catch((err) => {
          showError(err.message);
        });
      }
    });
  };

  const updateProfileData = () => {
    const data = profile;
    data.photo = profile.photoForDB;
    delete data.photoForDB;
    Fire.database()
      .ref(`users/${profile.uid}/`)
      .update(data)
      .then(() => {
        storeData('user', data)
          .then(() => {
            navigation.replace('MainApp');
          })
          .catch(() => {
            showError('Terjadi Masalah');
          });
        console.log('success: ', data);
      })
      .catch((err) => {
        showError(err.message);
      });
  };

  const changeText = (key, value) => {
    setProfile({
      ...profile,
      [key]: value,
    });
  };

  const getImage = () => {
    ImagePicker.launchImageLibrary(
      {quality: 0.5, maxWidth: 200, maxHeight: 200},
      (response) => {
        console.log('response: ', response);
        if (response.didCancel || response.error) {
          showError('oops, sepertinya ada tidak memilih fotonya?');
        } else {
          console.log('response getImage: ', response);
          const source = {uri: response.uri};
          // setPhotoForDB(`data:${response.type};base64, ${response.data}`);
          setProfile({
            ...profile,
            photoForDB: `data:${response.type};base64, ${response.data}`,
          });
          setPhoto(source);
        }
      },
    );
  };

  return (
    <View style={styles.page}>
      <Header title="Edit Profile" onPress={() => navigation.goBack()} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Profile isRemove photo={photo} onPress={getImage} />
          <Gap height={26} />
          <Input
            label="Full Name"
            value={profile.fullName}
            onChangeText={(value) => changeText('fullName', value)}
          />
          <Gap height={24} />
          <Input
            label="Pekerjaan"
            value={profile.profession}
            onChangeText={(value) => changeText('profession', value)}
          />
          <Gap height={24} />
          <Input label="Email" value={profile.email} disable />
          <Gap height={24} />
          <Input
            label="Password"
            value={password}
            secureTextEntry
            onChangeText={(value) => setPassword(value)}
          />
          <Gap height={40} />
          <Button title="Save Profile" onPress={update} />
        </View>
      </ScrollView>
    </View>
  );
};

export default UpdateProfile;

const styles = StyleSheet.create({
  page: {flex: 1, backgroundColor: colors.white},
  content: {padding: 40, paddingTop: 0},
});
