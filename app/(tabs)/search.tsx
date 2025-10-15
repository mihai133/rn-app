import { icons } from '@/constants/icons'
import { images } from '@/constants/images'
import { fetchMovies } from '@/services/api'
import { updateSearchCount } from '@/services/appwrite'
import useFetch from '@/services/useFetch'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, FlatList, Image, Keyboard, Text, View } from 'react-native'
import MovieCard from '../components/MovieCard'
import SearchBar from '../components/SearchBar'

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: movies = [] as Movie[] | null,
    loading,
    error,
    refetch: loadMovies,
    reset,
  } = useFetch(() => fetchMovies({ query: searchQuery }), false);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (searchQuery.trim()) {
        const refetchedMovies = await loadMovies();
        // Call updateSearchCount only if there are results
        if (refetchedMovies?.length! > 0 && refetchedMovies?.length! > 0) {
          await updateSearchCount(searchQuery, refetchedMovies[0]);
        }
      } else {
        reset();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  return (
    <View className='flex-1 bg-primary'>
      <Image source={images.bg} className="flex-1 absolute h-full z-0" resizeMode='cover' />
      <FlatList
        data={movies as Movie[]}
        renderItem={({ item }) => <MovieCard {...item} />}
        keyExtractor={(item) => item?.id.toString()}
        className='px-5 '
        numColumns={3}
        onScroll={({ nativeEvent }) => {
          if (nativeEvent.contentOffset.y > 0) {
            Keyboard.dismiss()
          }
        }}
        columnWrapperStyle={{
          justifyContent: 'center',
          gap: 16,
          marginVertical: 16,
        }}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListHeaderComponent={
          <>
            <View className="w-full flex-row justify-center mt-20 items-center">
              <Image source={icons.logo} className="w-12 h-10" />
            </View>

            <View className="my-5">
              <SearchBar
                placeholder="Search for a movie"
                value={searchQuery}
                onChangeText={(text: string) => {
                  setSearchQuery(text)
                }}
                autoFocus={true}
              />
            </View>

            {loading && (
              <ActivityIndicator
                size="large"
                color="#0000ff"
                className="my-3"
              />
            )}

            {error && (
              <Text className="text-red-500 px-5 my-3">
                Error: {error.message}
              </Text>
            )}

            {!loading &&
              !error &&
              searchQuery.trim() &&
              movies?.length! > 0 && (
                <Text className="text-xl text-white font-bold">
                  Search Results for{" "}
                  <Text className="text-accent">{searchQuery}</Text>
                </Text>
              )}
          </>}
        ListEmptyComponent={
          !loading && !error ? (
            <View className='mt-10 px-5'>
              <Text className="text-center text-gray-500">
                {searchQuery.trim() ? `No movies found"` : 'Search for a movie'}
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  )
}

export default Search
