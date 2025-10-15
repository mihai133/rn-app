import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { fetchMovies } from "@/services/api";
import { getTrendingMovies } from "@/services/appwrite";
import useFetch from "@/services/useFetch";
import { useRouter } from "expo-router";
import { ActivityIndicator, FlatList, Image, ScrollView, Text, View } from "react-native";
import MovieCard from "../components/MovieCard";
import SearchBar from "../components/SearchBar";
import TrendingCard from "../components/TrendingCard";

export default function Index() {
  const router = useRouter();
  const {
    data: trendingMovies,
    loading: trendingMoviesLoading,
    error: trendingMoviesError
  } = useFetch(() => getTrendingMovies());
  console.log(trendingMovies)
  const {
    data: movies,
    loading: moviesLoading,
    error: moviesError } = useFetch(() => fetchMovies({
      query: '',
    }));

  return (
    <View className="flex-1 bg-primary ">
      <Image source={images.bg} className="absolute h-full z-0" />
      <Image source={icons.logo} className="w-12 h-10 rounded-full mt-20 mb-5 mx-auto" />
      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ minHeight: "100%", paddingBottom: 100 }}

      >

        {moviesLoading || trendingMoviesLoading ? (
          <ActivityIndicator size="large" color="#0000ff" className="mt-10 self-center" />
        ) : moviesError || trendingMoviesError ? (
          <Text className="text-secondary text-base font-semibold mt-10 self-center">Error: {moviesError?.message || trendingMoviesError?.message}</Text>
        ) : (
          <View className="flex-1 mt-5">
            <SearchBar
              onPress={() => {
                router.push("/search");
              }}
              placeholder="Search for movies"
              autoFocus={false}
            />

            {trendingMovies && (
              <View className="mt-3 mb-6">
                <Text className="text-lg text-white font-bold mt-2 mb-3">Trending Movies</Text>
                <FlatList
                  data={trendingMovies}
                  horizontal
                  ItemSeparatorComponent={() => <View className="w-4" />}
                  renderItem={({ item, index }) => (
                    <TrendingCard
                      movie={item}
                      index={index}
                    />

                  )}
                  keyExtractor={(item) => item.movie_id.toString()}
                  className="mt-2"
                />
              </View>
            )}
            <>
              <Text className="text-lg text-white font-bold mb-3">Latest Movies</Text>
              <FlatList
                data={movies as Movie[]}
                renderItem={({ item }) => (
                  <MovieCard
                    id={item?.id}
                    poster_path={item?.poster_path}
                    title={item?.title}
                    vote_average={item?.vote_average}
                    release_date={item?.release_date}
                  />
                )}
                keyExtractor={(item) => item?.id.toString()}
                numColumns={3}
                columnWrapperStyle={{ justifyContent: 'flex-start', gap: 20, paddingRight: 5, marginBottom: 10 }}
                className="mt-2 pb-32"
                scrollEnabled={false}
              />
            </>
          </View>
        )}

      </ScrollView>
    </View>
  );
}
