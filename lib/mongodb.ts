import mongoose, { ConnectOptions } from 'mongoose';

/**
 * Connection string for MongoDB.
 *
 * Must be provided via the MONGODB_URI environment variable, for example:
 *   MONGODB_URI="mongodb+srv://user:password@cluster0.mongodb.net/my-db"
 */
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable in your environment or .env.local file.',
  );
}

/**
 * Shape of the cached Mongoose connection and connection promise.
 *
 * This is stored on the global object in development to avoid creating
 * multiple connections during hot reloads.
 */
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

/**
 * Augment the Node.js global type with our Mongoose cache to keep typing strict.
 */
declare global {
  // eslint-disable-next-line no-var
  // `var` here ensures the declaration is attached to the global scope.
  var _mongooseCache: MongooseCache | undefined;
}

// Use the existing cache if it is already set on the global object, otherwise create a new one.
const globalForMongoose = globalThis as typeof globalThis & {
  _mongooseCache?: MongooseCache;
};

const cached: MongooseCache = globalForMongoose._mongooseCache ?? {
  conn: null,
  promise: null,
};

if (!globalForMongoose._mongooseCache) {
  globalForMongoose._mongooseCache = cached;
}

/**
 * Establishes (or reuses) a connection to MongoDB using Mongoose.
 *
 * The connection and the in-flight connection promise are cached on the
 * global object so that in development we do not open a new connection
 * on every hot reload.
 */
export async function connectToDatabase(): Promise<typeof mongoose> {
  // If we already have a resolved connection, reuse it.
  if (cached.conn) {
    return cached.conn;
  }

  // If a connection is already in progress, reuse the existing promise.
  if (!cached.promise) {
    const options: ConnectOptions = {
      // Disable Mongoose's internal query buffering in favor of failing fast
      // when the connection is not available.
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI as string, options).then((mongooseInstance) => {
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    // Reset the promise so that the next call can try again.
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}

export type DatabaseConnection = typeof mongoose;
