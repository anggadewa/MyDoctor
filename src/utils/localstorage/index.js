import AsyncStorage from '@react-native-community/async-storage';

export const storeData = async (key, value) => {
  try {
    //value yang diterima harus berupa sebuah string maka digunakanlah fungsi stringify
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    // saving error
  }
};

export const getData = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      //proses pengembalian data ke depan, maka value harus diubah lagi menjadi sebuah object, maka digunakanlah fungsi parse
      return JSON.parse(value);
    }
  } catch (e) {
    // error reading value
  }
};
