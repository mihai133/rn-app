import { icons } from '@/constants/icons';
import React from 'react';
import { Image, TextInput, View } from 'react-native';

interface Props {
  onPress?: () => void;
  placeholder: string;
}

const SearchBar = ({ onPress, placeholder }: Props) => {
  return (
    <View className='flex-row items-center  px-5 py-4'>
      <Image source={icons.search} className='size-5 w-6 h-6' resizeMode='contain' tintColor="#ab8bff" />
      <TextInput
        onPress={onPress}
        placeholder={placeholder}
        value=''
        onChangeText={(text) => { }}
        placeholderTextColor='#a8b5db'
        className='flex-1 ml-2 text-base font-semibold text-secondary'
      />
    </View>
  )
}

export default SearchBar