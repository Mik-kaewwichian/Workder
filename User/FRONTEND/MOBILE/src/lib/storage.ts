import AsyncStorage from '@react-native-async-storage/async-storage';

export const storage = {
  getItem: async (name: string): Promise<string | null> => {
    try {
      const value = await AsyncStorage.getItem(name);
      return value ?? null;
    } catch (e) {
      console.error(`Error reading ${name} from AsyncStorage`, e);
      return null;
    }
  },
  setItem: async (name: string, value: string): Promise<void> => {
    try {
      await AsyncStorage.setItem(name, value);
    } catch (e) {
      console.error(`Error saving ${name} to AsyncStorage`, e);
    }
  },
  removeItem: async (name: string): Promise<void> => {
    try {
      await AsyncStorage.removeItem(name);
    } catch (e) {
      console.error(`Error removing ${name} from AsyncStorage`, e);
    }
  },
};
