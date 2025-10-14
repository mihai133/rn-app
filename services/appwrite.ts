import { Client, ID, Query, TablesDB } from 'react-native-appwrite';

// track searches by user 
const PROJECT_ID = process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!;
const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DB_ID!;
const DB_NAME = process.env.EXPO_PUBLIC_APPWRITE_DB_NAME!;

console.log("LOGGING RESULT---------")
console.log(PROJECT_ID)
console.log(DATABASE_ID)
console.log(DB_NAME)
console.log("END LOGGING RESULT---------")
const client = new Client()
  .setEndpoint('https://fra.cloud.appwrite.io/v1')
  .setProject(PROJECT_ID)   //  Project ID

const tablesDB = new TablesDB(client);

export const updateSearchCount = async (query:string, movie: Movie) => {
  console.log(query, movie)
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
      console.log("-----EXISTING MOVIE-----")
      console.log(existingMovie)
      await tablesDB.updateRow({
        databaseId: DATABASE_ID,
        tableId: DB_NAME,
        rowId: existingMovie.id,
        data: {
          count: existingMovie.count + 1,
        }
      })
    } else {
      console.log("-----CREATING NEW MOVIE-----")
      console.log(movie)
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
    // console.log("LOGGING RESULT---------")
    console.log(result)
    // console.log("END LOGGING RESULT---------")
  
  } catch (err) {
    console.log(err);
    throw err;
  }
  
// If a document is found increment the search field
// if. no document is found => new search term => create a new document

}