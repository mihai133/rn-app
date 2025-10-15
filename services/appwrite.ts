import { Client, ID, Query, TablesDB } from 'react-native-appwrite';

// track searches by user 
const PROJECT_ID = process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!;
const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DB_ID!;
const DB_NAME = process.env.EXPO_PUBLIC_APPWRITE_DB_NAME!;

const client = new Client()
  .setEndpoint('https://fra.cloud.appwrite.io/v1')
  .setProject(PROJECT_ID)   //  Project ID

const tablesDB = new TablesDB(client);

export const updateSearchCount = async (query:string, movie: Movie) => {
  try {
    const result = await tablesDB.listRows({
    databaseId: DATABASE_ID,
    tableId: DB_NAME,
    queries: [
      Query.equal('searchTerm', query),
    ]
  })

    // check if a record of that search has already been stored
    if((result?.rows?.length > 0)) {
      const existingMovie = result.rows[0];
      await tablesDB.updateRow(
        DATABASE_ID,
        DB_NAME,
        existingMovie?.$id,
        {
          count: existingMovie.count + 1,
        }
      )
    } else {
      await tablesDB.createRow({
        databaseId: DATABASE_ID,
        tableId: DB_NAME,
        rowId: ID.unique(),
        data: {
          movie_id: movie?.id,
          searchTerm: query,
          title: movie?.title,
          count: 1,
          poster_url: `https://image.tmdb.org/t/p/w500${movie?.poster_path}`,
        }
      })
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
  
// If a document is found increment the search field
// if. no document is found => new search term => create a new document

}

export const getTrendingMovies = async (): Promise<TrendingMovie[] | undefined> => {
  try {
    const result = await tablesDB.listRows({
      databaseId: DATABASE_ID,
      tableId: DB_NAME,
      queries: [
        Query.limit(5),
        Query.orderDesc('count'),
      ]
    })
  
    return result?.rows as unknown as TrendingMovie[]

  } catch (error) {
    console.log(error)
    return undefined;
  }
}