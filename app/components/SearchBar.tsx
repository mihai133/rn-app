import { icons } from '@/constants/icons';
import React from 'react';
import { Image, TextInput, View } from 'react-native';

interface Props {
  onPress?: () => void;
  placeholder: string;
  value?: string;
  onChangeText?: (text: string) => void;
  autoFocus: boolean
}

const SearchBar = ({ onPress, placeholder, value, onChangeText, autoFocus }: Props) => {
  return (
    <View className='flex-row items-center  px-5 py-4'>
      <Image source={icons.search} className='size-5 w-6 h-6' resizeMode='contain' tintColor="#ab8bff" />
      <TextInput
        autoFocus={autoFocus}
        onPress={onPress}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        className="flex-1 ml-2 py-2 font-semibold text-white text-md "
        placeholderTextColor="#A8B5DB"
      />
    </View>
  )
}

export default SearchBar