
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model UserActivityLog
 * 
 */
export type UserActivityLog = $Result.DefaultSelection<Prisma.$UserActivityLogPayload>
/**
 * Model Job
 * 
 */
export type Job = $Result.DefaultSelection<Prisma.$JobPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.userActivityLog`: Exposes CRUD operations for the **UserActivityLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UserActivityLogs
    * const userActivityLogs = await prisma.userActivityLog.findMany()
    * ```
    */
  get userActivityLog(): Prisma.UserActivityLogDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.job`: Exposes CRUD operations for the **Job** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Jobs
    * const jobs = await prisma.job.findMany()
    * ```
    */
  get job(): Prisma.JobDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.19.2
   * Query Engine version: c2990dca591cba766e3b7ef5d9e8a84796e47ab7
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    UserActivityLog: 'UserActivityLog',
    Job: 'Job'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "userActivityLog" | "job"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      UserActivityLog: {
        payload: Prisma.$UserActivityLogPayload<ExtArgs>
        fields: Prisma.UserActivityLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserActivityLogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserActivityLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserActivityLogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserActivityLogPayload>
          }
          findFirst: {
            args: Prisma.UserActivityLogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserActivityLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserActivityLogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserActivityLogPayload>
          }
          findMany: {
            args: Prisma.UserActivityLogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserActivityLogPayload>[]
          }
          create: {
            args: Prisma.UserActivityLogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserActivityLogPayload>
          }
          createMany: {
            args: Prisma.UserActivityLogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserActivityLogCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserActivityLogPayload>[]
          }
          delete: {
            args: Prisma.UserActivityLogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserActivityLogPayload>
          }
          update: {
            args: Prisma.UserActivityLogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserActivityLogPayload>
          }
          deleteMany: {
            args: Prisma.UserActivityLogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserActivityLogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserActivityLogUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserActivityLogPayload>[]
          }
          upsert: {
            args: Prisma.UserActivityLogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserActivityLogPayload>
          }
          aggregate: {
            args: Prisma.UserActivityLogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUserActivityLog>
          }
          groupBy: {
            args: Prisma.UserActivityLogGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserActivityLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserActivityLogCountArgs<ExtArgs>
            result: $Utils.Optional<UserActivityLogCountAggregateOutputType> | number
          }
        }
      }
      Job: {
        payload: Prisma.$JobPayload<ExtArgs>
        fields: Prisma.JobFieldRefs
        operations: {
          findUnique: {
            args: Prisma.JobFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JobPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.JobFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JobPayload>
          }
          findFirst: {
            args: Prisma.JobFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JobPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.JobFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JobPayload>
          }
          findMany: {
            args: Prisma.JobFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JobPayload>[]
          }
          create: {
            args: Prisma.JobCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JobPayload>
          }
          createMany: {
            args: Prisma.JobCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.JobCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JobPayload>[]
          }
          delete: {
            args: Prisma.JobDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JobPayload>
          }
          update: {
            args: Prisma.JobUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JobPayload>
          }
          deleteMany: {
            args: Prisma.JobDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.JobUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.JobUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JobPayload>[]
          }
          upsert: {
            args: Prisma.JobUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JobPayload>
          }
          aggregate: {
            args: Prisma.JobAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateJob>
          }
          groupBy: {
            args: Prisma.JobGroupByArgs<ExtArgs>
            result: $Utils.Optional<JobGroupByOutputType>[]
          }
          count: {
            args: Prisma.JobCountArgs<ExtArgs>
            result: $Utils.Optional<JobCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    userActivityLog?: UserActivityLogOmit
    job?: JobOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    jobsPosted: number
    activityLogs: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    jobsPosted?: boolean | UserCountOutputTypeCountJobsPostedArgs
    activityLogs?: boolean | UserCountOutputTypeCountActivityLogsArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountJobsPostedArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: JobWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountActivityLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserActivityLogWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserAvgAggregateOutputType = {
    id: number | null
    roleRank: number | null
    income: number | null
  }

  export type UserSumAggregateOutputType = {
    id: number | null
    roleRank: number | null
    income: number | null
  }

  export type UserMinAggregateOutputType = {
    id: number | null
    phone: string | null
    email: string | null
    role: string | null
    passwordHash: string | null
    managerCode: string | null
    workStatus: string | null
    roleRank: number | null
    googleId: string | null
    facebookId: string | null
    firstName: string | null
    lastName: string | null
    idCard: string | null
    address: string | null
    province: string | null
    district: string | null
    subDistrict: string | null
    zipCode: string | null
    birthDate: Date | null
    occupation: string | null
    income: number | null
    education: string | null
    certificates: string | null
    idCardFront: string | null
    idCardBack: string | null
    idCardSelfie: string | null
    faceScan: string | null
    profileCompleted: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: number | null
    phone: string | null
    email: string | null
    role: string | null
    passwordHash: string | null
    managerCode: string | null
    workStatus: string | null
    roleRank: number | null
    googleId: string | null
    facebookId: string | null
    firstName: string | null
    lastName: string | null
    idCard: string | null
    address: string | null
    province: string | null
    district: string | null
    subDistrict: string | null
    zipCode: string | null
    birthDate: Date | null
    occupation: string | null
    income: number | null
    education: string | null
    certificates: string | null
    idCardFront: string | null
    idCardBack: string | null
    idCardSelfie: string | null
    faceScan: string | null
    profileCompleted: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    phone: number
    email: number
    role: number
    passwordHash: number
    managerCode: number
    workStatus: number
    roleRank: number
    googleId: number
    facebookId: number
    firstName: number
    lastName: number
    idCard: number
    address: number
    province: number
    district: number
    subDistrict: number
    zipCode: number
    birthDate: number
    occupation: number
    income: number
    education: number
    certificates: number
    idCardFront: number
    idCardBack: number
    idCardSelfie: number
    faceScan: number
    profileCompleted: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserAvgAggregateInputType = {
    id?: true
    roleRank?: true
    income?: true
  }

  export type UserSumAggregateInputType = {
    id?: true
    roleRank?: true
    income?: true
  }

  export type UserMinAggregateInputType = {
    id?: true
    phone?: true
    email?: true
    role?: true
    passwordHash?: true
    managerCode?: true
    workStatus?: true
    roleRank?: true
    googleId?: true
    facebookId?: true
    firstName?: true
    lastName?: true
    idCard?: true
    address?: true
    province?: true
    district?: true
    subDistrict?: true
    zipCode?: true
    birthDate?: true
    occupation?: true
    income?: true
    education?: true
    certificates?: true
    idCardFront?: true
    idCardBack?: true
    idCardSelfie?: true
    faceScan?: true
    profileCompleted?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    phone?: true
    email?: true
    role?: true
    passwordHash?: true
    managerCode?: true
    workStatus?: true
    roleRank?: true
    googleId?: true
    facebookId?: true
    firstName?: true
    lastName?: true
    idCard?: true
    address?: true
    province?: true
    district?: true
    subDistrict?: true
    zipCode?: true
    birthDate?: true
    occupation?: true
    income?: true
    education?: true
    certificates?: true
    idCardFront?: true
    idCardBack?: true
    idCardSelfie?: true
    faceScan?: true
    profileCompleted?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    phone?: true
    email?: true
    role?: true
    passwordHash?: true
    managerCode?: true
    workStatus?: true
    roleRank?: true
    googleId?: true
    facebookId?: true
    firstName?: true
    lastName?: true
    idCard?: true
    address?: true
    province?: true
    district?: true
    subDistrict?: true
    zipCode?: true
    birthDate?: true
    occupation?: true
    income?: true
    education?: true
    certificates?: true
    idCardFront?: true
    idCardBack?: true
    idCardSelfie?: true
    faceScan?: true
    profileCompleted?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UserAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _avg?: UserAvgAggregateInputType
    _sum?: UserSumAggregateInputType
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: number
    phone: string | null
    email: string | null
    role: string
    passwordHash: string | null
    managerCode: string | null
    workStatus: string
    roleRank: number
    googleId: string | null
    facebookId: string | null
    firstName: string | null
    lastName: string | null
    idCard: string | null
    address: string | null
    province: string | null
    district: string | null
    subDistrict: string | null
    zipCode: string | null
    birthDate: Date | null
    occupation: string | null
    income: number | null
    education: string | null
    certificates: string | null
    idCardFront: string | null
    idCardBack: string | null
    idCardSelfie: string | null
    faceScan: string | null
    profileCompleted: boolean
    createdAt: Date
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    phone?: boolean
    email?: boolean
    role?: boolean
    passwordHash?: boolean
    managerCode?: boolean
    workStatus?: boolean
    roleRank?: boolean
    googleId?: boolean
    facebookId?: boolean
    firstName?: boolean
    lastName?: boolean
    idCard?: boolean
    address?: boolean
    province?: boolean
    district?: boolean
    subDistrict?: boolean
    zipCode?: boolean
    birthDate?: boolean
    occupation?: boolean
    income?: boolean
    education?: boolean
    certificates?: boolean
    idCardFront?: boolean
    idCardBack?: boolean
    idCardSelfie?: boolean
    faceScan?: boolean
    profileCompleted?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    jobsPosted?: boolean | User$jobsPostedArgs<ExtArgs>
    activityLogs?: boolean | User$activityLogsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    phone?: boolean
    email?: boolean
    role?: boolean
    passwordHash?: boolean
    managerCode?: boolean
    workStatus?: boolean
    roleRank?: boolean
    googleId?: boolean
    facebookId?: boolean
    firstName?: boolean
    lastName?: boolean
    idCard?: boolean
    address?: boolean
    province?: boolean
    district?: boolean
    subDistrict?: boolean
    zipCode?: boolean
    birthDate?: boolean
    occupation?: boolean
    income?: boolean
    education?: boolean
    certificates?: boolean
    idCardFront?: boolean
    idCardBack?: boolean
    idCardSelfie?: boolean
    faceScan?: boolean
    profileCompleted?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    phone?: boolean
    email?: boolean
    role?: boolean
    passwordHash?: boolean
    managerCode?: boolean
    workStatus?: boolean
    roleRank?: boolean
    googleId?: boolean
    facebookId?: boolean
    firstName?: boolean
    lastName?: boolean
    idCard?: boolean
    address?: boolean
    province?: boolean
    district?: boolean
    subDistrict?: boolean
    zipCode?: boolean
    birthDate?: boolean
    occupation?: boolean
    income?: boolean
    education?: boolean
    certificates?: boolean
    idCardFront?: boolean
    idCardBack?: boolean
    idCardSelfie?: boolean
    faceScan?: boolean
    profileCompleted?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    phone?: boolean
    email?: boolean
    role?: boolean
    passwordHash?: boolean
    managerCode?: boolean
    workStatus?: boolean
    roleRank?: boolean
    googleId?: boolean
    facebookId?: boolean
    firstName?: boolean
    lastName?: boolean
    idCard?: boolean
    address?: boolean
    province?: boolean
    district?: boolean
    subDistrict?: boolean
    zipCode?: boolean
    birthDate?: boolean
    occupation?: boolean
    income?: boolean
    education?: boolean
    certificates?: boolean
    idCardFront?: boolean
    idCardBack?: boolean
    idCardSelfie?: boolean
    faceScan?: boolean
    profileCompleted?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "phone" | "email" | "role" | "passwordHash" | "managerCode" | "workStatus" | "roleRank" | "googleId" | "facebookId" | "firstName" | "lastName" | "idCard" | "address" | "province" | "district" | "subDistrict" | "zipCode" | "birthDate" | "occupation" | "income" | "education" | "certificates" | "idCardFront" | "idCardBack" | "idCardSelfie" | "faceScan" | "profileCompleted" | "createdAt" | "updatedAt", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    jobsPosted?: boolean | User$jobsPostedArgs<ExtArgs>
    activityLogs?: boolean | User$activityLogsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      jobsPosted: Prisma.$JobPayload<ExtArgs>[]
      activityLogs: Prisma.$UserActivityLogPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      phone: string | null
      email: string | null
      role: string
      passwordHash: string | null
      managerCode: string | null
      workStatus: string
      roleRank: number
      googleId: string | null
      facebookId: string | null
      firstName: string | null
      lastName: string | null
      idCard: string | null
      address: string | null
      province: string | null
      district: string | null
      subDistrict: string | null
      zipCode: string | null
      birthDate: Date | null
      occupation: string | null
      income: number | null
      education: string | null
      certificates: string | null
      idCardFront: string | null
      idCardBack: string | null
      idCardSelfie: string | null
      faceScan: string | null
      profileCompleted: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    jobsPosted<T extends User$jobsPostedArgs<ExtArgs> = {}>(args?: Subset<T, User$jobsPostedArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$JobPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    activityLogs<T extends User$activityLogsArgs<ExtArgs> = {}>(args?: Subset<T, User$activityLogsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserActivityLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'Int'>
    readonly phone: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'String'>
    readonly passwordHash: FieldRef<"User", 'String'>
    readonly managerCode: FieldRef<"User", 'String'>
    readonly workStatus: FieldRef<"User", 'String'>
    readonly roleRank: FieldRef<"User", 'Int'>
    readonly googleId: FieldRef<"User", 'String'>
    readonly facebookId: FieldRef<"User", 'String'>
    readonly firstName: FieldRef<"User", 'String'>
    readonly lastName: FieldRef<"User", 'String'>
    readonly idCard: FieldRef<"User", 'String'>
    readonly address: FieldRef<"User", 'String'>
    readonly province: FieldRef<"User", 'String'>
    readonly district: FieldRef<"User", 'String'>
    readonly subDistrict: FieldRef<"User", 'String'>
    readonly zipCode: FieldRef<"User", 'String'>
    readonly birthDate: FieldRef<"User", 'DateTime'>
    readonly occupation: FieldRef<"User", 'String'>
    readonly income: FieldRef<"User", 'Int'>
    readonly education: FieldRef<"User", 'String'>
    readonly certificates: FieldRef<"User", 'String'>
    readonly idCardFront: FieldRef<"User", 'String'>
    readonly idCardBack: FieldRef<"User", 'String'>
    readonly idCardSelfie: FieldRef<"User", 'String'>
    readonly faceScan: FieldRef<"User", 'String'>
    readonly profileCompleted: FieldRef<"User", 'Boolean'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.jobsPosted
   */
  export type User$jobsPostedArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Job
     */
    select?: JobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Job
     */
    omit?: JobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobInclude<ExtArgs> | null
    where?: JobWhereInput
    orderBy?: JobOrderByWithRelationInput | JobOrderByWithRelationInput[]
    cursor?: JobWhereUniqueInput
    take?: number
    skip?: number
    distinct?: JobScalarFieldEnum | JobScalarFieldEnum[]
  }

  /**
   * User.activityLogs
   */
  export type User$activityLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserActivityLog
     */
    select?: UserActivityLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserActivityLog
     */
    omit?: UserActivityLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserActivityLogInclude<ExtArgs> | null
    where?: UserActivityLogWhereInput
    orderBy?: UserActivityLogOrderByWithRelationInput | UserActivityLogOrderByWithRelationInput[]
    cursor?: UserActivityLogWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserActivityLogScalarFieldEnum | UserActivityLogScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model UserActivityLog
   */

  export type AggregateUserActivityLog = {
    _count: UserActivityLogCountAggregateOutputType | null
    _avg: UserActivityLogAvgAggregateOutputType | null
    _sum: UserActivityLogSumAggregateOutputType | null
    _min: UserActivityLogMinAggregateOutputType | null
    _max: UserActivityLogMaxAggregateOutputType | null
  }

  export type UserActivityLogAvgAggregateOutputType = {
    id: number | null
    targetUserId: number | null
    actorUserId: number | null
  }

  export type UserActivityLogSumAggregateOutputType = {
    id: number | null
    targetUserId: number | null
    actorUserId: number | null
  }

  export type UserActivityLogMinAggregateOutputType = {
    id: number | null
    action: string | null
    targetUserId: number | null
    targetEmail: string | null
    targetRole: string | null
    actorUserId: number | null
    actorEmail: string | null
    actorManagerCode: string | null
    createdAt: Date | null
  }

  export type UserActivityLogMaxAggregateOutputType = {
    id: number | null
    action: string | null
    targetUserId: number | null
    targetEmail: string | null
    targetRole: string | null
    actorUserId: number | null
    actorEmail: string | null
    actorManagerCode: string | null
    createdAt: Date | null
  }

  export type UserActivityLogCountAggregateOutputType = {
    id: number
    action: number
    targetUserId: number
    targetEmail: number
    targetRole: number
    actorUserId: number
    actorEmail: number
    actorManagerCode: number
    createdAt: number
    _all: number
  }


  export type UserActivityLogAvgAggregateInputType = {
    id?: true
    targetUserId?: true
    actorUserId?: true
  }

  export type UserActivityLogSumAggregateInputType = {
    id?: true
    targetUserId?: true
    actorUserId?: true
  }

  export type UserActivityLogMinAggregateInputType = {
    id?: true
    action?: true
    targetUserId?: true
    targetEmail?: true
    targetRole?: true
    actorUserId?: true
    actorEmail?: true
    actorManagerCode?: true
    createdAt?: true
  }

  export type UserActivityLogMaxAggregateInputType = {
    id?: true
    action?: true
    targetUserId?: true
    targetEmail?: true
    targetRole?: true
    actorUserId?: true
    actorEmail?: true
    actorManagerCode?: true
    createdAt?: true
  }

  export type UserActivityLogCountAggregateInputType = {
    id?: true
    action?: true
    targetUserId?: true
    targetEmail?: true
    targetRole?: true
    actorUserId?: true
    actorEmail?: true
    actorManagerCode?: true
    createdAt?: true
    _all?: true
  }

  export type UserActivityLogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserActivityLog to aggregate.
     */
    where?: UserActivityLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserActivityLogs to fetch.
     */
    orderBy?: UserActivityLogOrderByWithRelationInput | UserActivityLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserActivityLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserActivityLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserActivityLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned UserActivityLogs
    **/
    _count?: true | UserActivityLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UserActivityLogAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserActivityLogSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserActivityLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserActivityLogMaxAggregateInputType
  }

  export type GetUserActivityLogAggregateType<T extends UserActivityLogAggregateArgs> = {
        [P in keyof T & keyof AggregateUserActivityLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUserActivityLog[P]>
      : GetScalarType<T[P], AggregateUserActivityLog[P]>
  }




  export type UserActivityLogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserActivityLogWhereInput
    orderBy?: UserActivityLogOrderByWithAggregationInput | UserActivityLogOrderByWithAggregationInput[]
    by: UserActivityLogScalarFieldEnum[] | UserActivityLogScalarFieldEnum
    having?: UserActivityLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserActivityLogCountAggregateInputType | true
    _avg?: UserActivityLogAvgAggregateInputType
    _sum?: UserActivityLogSumAggregateInputType
    _min?: UserActivityLogMinAggregateInputType
    _max?: UserActivityLogMaxAggregateInputType
  }

  export type UserActivityLogGroupByOutputType = {
    id: number
    action: string
    targetUserId: number | null
    targetEmail: string | null
    targetRole: string | null
    actorUserId: number | null
    actorEmail: string | null
    actorManagerCode: string | null
    createdAt: Date
    _count: UserActivityLogCountAggregateOutputType | null
    _avg: UserActivityLogAvgAggregateOutputType | null
    _sum: UserActivityLogSumAggregateOutputType | null
    _min: UserActivityLogMinAggregateOutputType | null
    _max: UserActivityLogMaxAggregateOutputType | null
  }

  type GetUserActivityLogGroupByPayload<T extends UserActivityLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserActivityLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserActivityLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserActivityLogGroupByOutputType[P]>
            : GetScalarType<T[P], UserActivityLogGroupByOutputType[P]>
        }
      >
    >


  export type UserActivityLogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    action?: boolean
    targetUserId?: boolean
    targetEmail?: boolean
    targetRole?: boolean
    actorUserId?: boolean
    actorEmail?: boolean
    actorManagerCode?: boolean
    createdAt?: boolean
    actor?: boolean | UserActivityLog$actorArgs<ExtArgs>
  }, ExtArgs["result"]["userActivityLog"]>

  export type UserActivityLogSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    action?: boolean
    targetUserId?: boolean
    targetEmail?: boolean
    targetRole?: boolean
    actorUserId?: boolean
    actorEmail?: boolean
    actorManagerCode?: boolean
    createdAt?: boolean
    actor?: boolean | UserActivityLog$actorArgs<ExtArgs>
  }, ExtArgs["result"]["userActivityLog"]>

  export type UserActivityLogSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    action?: boolean
    targetUserId?: boolean
    targetEmail?: boolean
    targetRole?: boolean
    actorUserId?: boolean
    actorEmail?: boolean
    actorManagerCode?: boolean
    createdAt?: boolean
    actor?: boolean | UserActivityLog$actorArgs<ExtArgs>
  }, ExtArgs["result"]["userActivityLog"]>

  export type UserActivityLogSelectScalar = {
    id?: boolean
    action?: boolean
    targetUserId?: boolean
    targetEmail?: boolean
    targetRole?: boolean
    actorUserId?: boolean
    actorEmail?: boolean
    actorManagerCode?: boolean
    createdAt?: boolean
  }

  export type UserActivityLogOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "action" | "targetUserId" | "targetEmail" | "targetRole" | "actorUserId" | "actorEmail" | "actorManagerCode" | "createdAt", ExtArgs["result"]["userActivityLog"]>
  export type UserActivityLogInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    actor?: boolean | UserActivityLog$actorArgs<ExtArgs>
  }
  export type UserActivityLogIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    actor?: boolean | UserActivityLog$actorArgs<ExtArgs>
  }
  export type UserActivityLogIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    actor?: boolean | UserActivityLog$actorArgs<ExtArgs>
  }

  export type $UserActivityLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "UserActivityLog"
    objects: {
      actor: Prisma.$UserPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      action: string
      targetUserId: number | null
      targetEmail: string | null
      targetRole: string | null
      actorUserId: number | null
      actorEmail: string | null
      actorManagerCode: string | null
      createdAt: Date
    }, ExtArgs["result"]["userActivityLog"]>
    composites: {}
  }

  type UserActivityLogGetPayload<S extends boolean | null | undefined | UserActivityLogDefaultArgs> = $Result.GetResult<Prisma.$UserActivityLogPayload, S>

  type UserActivityLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserActivityLogFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserActivityLogCountAggregateInputType | true
    }

  export interface UserActivityLogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['UserActivityLog'], meta: { name: 'UserActivityLog' } }
    /**
     * Find zero or one UserActivityLog that matches the filter.
     * @param {UserActivityLogFindUniqueArgs} args - Arguments to find a UserActivityLog
     * @example
     * // Get one UserActivityLog
     * const userActivityLog = await prisma.userActivityLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserActivityLogFindUniqueArgs>(args: SelectSubset<T, UserActivityLogFindUniqueArgs<ExtArgs>>): Prisma__UserActivityLogClient<$Result.GetResult<Prisma.$UserActivityLogPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one UserActivityLog that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserActivityLogFindUniqueOrThrowArgs} args - Arguments to find a UserActivityLog
     * @example
     * // Get one UserActivityLog
     * const userActivityLog = await prisma.userActivityLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserActivityLogFindUniqueOrThrowArgs>(args: SelectSubset<T, UserActivityLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserActivityLogClient<$Result.GetResult<Prisma.$UserActivityLogPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserActivityLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserActivityLogFindFirstArgs} args - Arguments to find a UserActivityLog
     * @example
     * // Get one UserActivityLog
     * const userActivityLog = await prisma.userActivityLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserActivityLogFindFirstArgs>(args?: SelectSubset<T, UserActivityLogFindFirstArgs<ExtArgs>>): Prisma__UserActivityLogClient<$Result.GetResult<Prisma.$UserActivityLogPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserActivityLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserActivityLogFindFirstOrThrowArgs} args - Arguments to find a UserActivityLog
     * @example
     * // Get one UserActivityLog
     * const userActivityLog = await prisma.userActivityLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserActivityLogFindFirstOrThrowArgs>(args?: SelectSubset<T, UserActivityLogFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserActivityLogClient<$Result.GetResult<Prisma.$UserActivityLogPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more UserActivityLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserActivityLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UserActivityLogs
     * const userActivityLogs = await prisma.userActivityLog.findMany()
     * 
     * // Get first 10 UserActivityLogs
     * const userActivityLogs = await prisma.userActivityLog.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userActivityLogWithIdOnly = await prisma.userActivityLog.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserActivityLogFindManyArgs>(args?: SelectSubset<T, UserActivityLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserActivityLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a UserActivityLog.
     * @param {UserActivityLogCreateArgs} args - Arguments to create a UserActivityLog.
     * @example
     * // Create one UserActivityLog
     * const UserActivityLog = await prisma.userActivityLog.create({
     *   data: {
     *     // ... data to create a UserActivityLog
     *   }
     * })
     * 
     */
    create<T extends UserActivityLogCreateArgs>(args: SelectSubset<T, UserActivityLogCreateArgs<ExtArgs>>): Prisma__UserActivityLogClient<$Result.GetResult<Prisma.$UserActivityLogPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many UserActivityLogs.
     * @param {UserActivityLogCreateManyArgs} args - Arguments to create many UserActivityLogs.
     * @example
     * // Create many UserActivityLogs
     * const userActivityLog = await prisma.userActivityLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserActivityLogCreateManyArgs>(args?: SelectSubset<T, UserActivityLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many UserActivityLogs and returns the data saved in the database.
     * @param {UserActivityLogCreateManyAndReturnArgs} args - Arguments to create many UserActivityLogs.
     * @example
     * // Create many UserActivityLogs
     * const userActivityLog = await prisma.userActivityLog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many UserActivityLogs and only return the `id`
     * const userActivityLogWithIdOnly = await prisma.userActivityLog.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserActivityLogCreateManyAndReturnArgs>(args?: SelectSubset<T, UserActivityLogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserActivityLogPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a UserActivityLog.
     * @param {UserActivityLogDeleteArgs} args - Arguments to delete one UserActivityLog.
     * @example
     * // Delete one UserActivityLog
     * const UserActivityLog = await prisma.userActivityLog.delete({
     *   where: {
     *     // ... filter to delete one UserActivityLog
     *   }
     * })
     * 
     */
    delete<T extends UserActivityLogDeleteArgs>(args: SelectSubset<T, UserActivityLogDeleteArgs<ExtArgs>>): Prisma__UserActivityLogClient<$Result.GetResult<Prisma.$UserActivityLogPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one UserActivityLog.
     * @param {UserActivityLogUpdateArgs} args - Arguments to update one UserActivityLog.
     * @example
     * // Update one UserActivityLog
     * const userActivityLog = await prisma.userActivityLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserActivityLogUpdateArgs>(args: SelectSubset<T, UserActivityLogUpdateArgs<ExtArgs>>): Prisma__UserActivityLogClient<$Result.GetResult<Prisma.$UserActivityLogPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more UserActivityLogs.
     * @param {UserActivityLogDeleteManyArgs} args - Arguments to filter UserActivityLogs to delete.
     * @example
     * // Delete a few UserActivityLogs
     * const { count } = await prisma.userActivityLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserActivityLogDeleteManyArgs>(args?: SelectSubset<T, UserActivityLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserActivityLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserActivityLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UserActivityLogs
     * const userActivityLog = await prisma.userActivityLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserActivityLogUpdateManyArgs>(args: SelectSubset<T, UserActivityLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserActivityLogs and returns the data updated in the database.
     * @param {UserActivityLogUpdateManyAndReturnArgs} args - Arguments to update many UserActivityLogs.
     * @example
     * // Update many UserActivityLogs
     * const userActivityLog = await prisma.userActivityLog.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more UserActivityLogs and only return the `id`
     * const userActivityLogWithIdOnly = await prisma.userActivityLog.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserActivityLogUpdateManyAndReturnArgs>(args: SelectSubset<T, UserActivityLogUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserActivityLogPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one UserActivityLog.
     * @param {UserActivityLogUpsertArgs} args - Arguments to update or create a UserActivityLog.
     * @example
     * // Update or create a UserActivityLog
     * const userActivityLog = await prisma.userActivityLog.upsert({
     *   create: {
     *     // ... data to create a UserActivityLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UserActivityLog we want to update
     *   }
     * })
     */
    upsert<T extends UserActivityLogUpsertArgs>(args: SelectSubset<T, UserActivityLogUpsertArgs<ExtArgs>>): Prisma__UserActivityLogClient<$Result.GetResult<Prisma.$UserActivityLogPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of UserActivityLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserActivityLogCountArgs} args - Arguments to filter UserActivityLogs to count.
     * @example
     * // Count the number of UserActivityLogs
     * const count = await prisma.userActivityLog.count({
     *   where: {
     *     // ... the filter for the UserActivityLogs we want to count
     *   }
     * })
    **/
    count<T extends UserActivityLogCountArgs>(
      args?: Subset<T, UserActivityLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserActivityLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UserActivityLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserActivityLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserActivityLogAggregateArgs>(args: Subset<T, UserActivityLogAggregateArgs>): Prisma.PrismaPromise<GetUserActivityLogAggregateType<T>>

    /**
     * Group by UserActivityLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserActivityLogGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserActivityLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserActivityLogGroupByArgs['orderBy'] }
        : { orderBy?: UserActivityLogGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserActivityLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserActivityLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the UserActivityLog model
   */
  readonly fields: UserActivityLogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for UserActivityLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserActivityLogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    actor<T extends UserActivityLog$actorArgs<ExtArgs> = {}>(args?: Subset<T, UserActivityLog$actorArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the UserActivityLog model
   */
  interface UserActivityLogFieldRefs {
    readonly id: FieldRef<"UserActivityLog", 'Int'>
    readonly action: FieldRef<"UserActivityLog", 'String'>
    readonly targetUserId: FieldRef<"UserActivityLog", 'Int'>
    readonly targetEmail: FieldRef<"UserActivityLog", 'String'>
    readonly targetRole: FieldRef<"UserActivityLog", 'String'>
    readonly actorUserId: FieldRef<"UserActivityLog", 'Int'>
    readonly actorEmail: FieldRef<"UserActivityLog", 'String'>
    readonly actorManagerCode: FieldRef<"UserActivityLog", 'String'>
    readonly createdAt: FieldRef<"UserActivityLog", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * UserActivityLog findUnique
   */
  export type UserActivityLogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserActivityLog
     */
    select?: UserActivityLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserActivityLog
     */
    omit?: UserActivityLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserActivityLogInclude<ExtArgs> | null
    /**
     * Filter, which UserActivityLog to fetch.
     */
    where: UserActivityLogWhereUniqueInput
  }

  /**
   * UserActivityLog findUniqueOrThrow
   */
  export type UserActivityLogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserActivityLog
     */
    select?: UserActivityLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserActivityLog
     */
    omit?: UserActivityLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserActivityLogInclude<ExtArgs> | null
    /**
     * Filter, which UserActivityLog to fetch.
     */
    where: UserActivityLogWhereUniqueInput
  }

  /**
   * UserActivityLog findFirst
   */
  export type UserActivityLogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserActivityLog
     */
    select?: UserActivityLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserActivityLog
     */
    omit?: UserActivityLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserActivityLogInclude<ExtArgs> | null
    /**
     * Filter, which UserActivityLog to fetch.
     */
    where?: UserActivityLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserActivityLogs to fetch.
     */
    orderBy?: UserActivityLogOrderByWithRelationInput | UserActivityLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserActivityLogs.
     */
    cursor?: UserActivityLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserActivityLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserActivityLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserActivityLogs.
     */
    distinct?: UserActivityLogScalarFieldEnum | UserActivityLogScalarFieldEnum[]
  }

  /**
   * UserActivityLog findFirstOrThrow
   */
  export type UserActivityLogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserActivityLog
     */
    select?: UserActivityLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserActivityLog
     */
    omit?: UserActivityLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserActivityLogInclude<ExtArgs> | null
    /**
     * Filter, which UserActivityLog to fetch.
     */
    where?: UserActivityLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserActivityLogs to fetch.
     */
    orderBy?: UserActivityLogOrderByWithRelationInput | UserActivityLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserActivityLogs.
     */
    cursor?: UserActivityLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserActivityLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserActivityLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserActivityLogs.
     */
    distinct?: UserActivityLogScalarFieldEnum | UserActivityLogScalarFieldEnum[]
  }

  /**
   * UserActivityLog findMany
   */
  export type UserActivityLogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserActivityLog
     */
    select?: UserActivityLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserActivityLog
     */
    omit?: UserActivityLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserActivityLogInclude<ExtArgs> | null
    /**
     * Filter, which UserActivityLogs to fetch.
     */
    where?: UserActivityLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserActivityLogs to fetch.
     */
    orderBy?: UserActivityLogOrderByWithRelationInput | UserActivityLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing UserActivityLogs.
     */
    cursor?: UserActivityLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserActivityLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserActivityLogs.
     */
    skip?: number
    distinct?: UserActivityLogScalarFieldEnum | UserActivityLogScalarFieldEnum[]
  }

  /**
   * UserActivityLog create
   */
  export type UserActivityLogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserActivityLog
     */
    select?: UserActivityLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserActivityLog
     */
    omit?: UserActivityLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserActivityLogInclude<ExtArgs> | null
    /**
     * The data needed to create a UserActivityLog.
     */
    data: XOR<UserActivityLogCreateInput, UserActivityLogUncheckedCreateInput>
  }

  /**
   * UserActivityLog createMany
   */
  export type UserActivityLogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many UserActivityLogs.
     */
    data: UserActivityLogCreateManyInput | UserActivityLogCreateManyInput[]
  }

  /**
   * UserActivityLog createManyAndReturn
   */
  export type UserActivityLogCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserActivityLog
     */
    select?: UserActivityLogSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserActivityLog
     */
    omit?: UserActivityLogOmit<ExtArgs> | null
    /**
     * The data used to create many UserActivityLogs.
     */
    data: UserActivityLogCreateManyInput | UserActivityLogCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserActivityLogIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * UserActivityLog update
   */
  export type UserActivityLogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserActivityLog
     */
    select?: UserActivityLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserActivityLog
     */
    omit?: UserActivityLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserActivityLogInclude<ExtArgs> | null
    /**
     * The data needed to update a UserActivityLog.
     */
    data: XOR<UserActivityLogUpdateInput, UserActivityLogUncheckedUpdateInput>
    /**
     * Choose, which UserActivityLog to update.
     */
    where: UserActivityLogWhereUniqueInput
  }

  /**
   * UserActivityLog updateMany
   */
  export type UserActivityLogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update UserActivityLogs.
     */
    data: XOR<UserActivityLogUpdateManyMutationInput, UserActivityLogUncheckedUpdateManyInput>
    /**
     * Filter which UserActivityLogs to update
     */
    where?: UserActivityLogWhereInput
    /**
     * Limit how many UserActivityLogs to update.
     */
    limit?: number
  }

  /**
   * UserActivityLog updateManyAndReturn
   */
  export type UserActivityLogUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserActivityLog
     */
    select?: UserActivityLogSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserActivityLog
     */
    omit?: UserActivityLogOmit<ExtArgs> | null
    /**
     * The data used to update UserActivityLogs.
     */
    data: XOR<UserActivityLogUpdateManyMutationInput, UserActivityLogUncheckedUpdateManyInput>
    /**
     * Filter which UserActivityLogs to update
     */
    where?: UserActivityLogWhereInput
    /**
     * Limit how many UserActivityLogs to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserActivityLogIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * UserActivityLog upsert
   */
  export type UserActivityLogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserActivityLog
     */
    select?: UserActivityLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserActivityLog
     */
    omit?: UserActivityLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserActivityLogInclude<ExtArgs> | null
    /**
     * The filter to search for the UserActivityLog to update in case it exists.
     */
    where: UserActivityLogWhereUniqueInput
    /**
     * In case the UserActivityLog found by the `where` argument doesn't exist, create a new UserActivityLog with this data.
     */
    create: XOR<UserActivityLogCreateInput, UserActivityLogUncheckedCreateInput>
    /**
     * In case the UserActivityLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserActivityLogUpdateInput, UserActivityLogUncheckedUpdateInput>
  }

  /**
   * UserActivityLog delete
   */
  export type UserActivityLogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserActivityLog
     */
    select?: UserActivityLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserActivityLog
     */
    omit?: UserActivityLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserActivityLogInclude<ExtArgs> | null
    /**
     * Filter which UserActivityLog to delete.
     */
    where: UserActivityLogWhereUniqueInput
  }

  /**
   * UserActivityLog deleteMany
   */
  export type UserActivityLogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserActivityLogs to delete
     */
    where?: UserActivityLogWhereInput
    /**
     * Limit how many UserActivityLogs to delete.
     */
    limit?: number
  }

  /**
   * UserActivityLog.actor
   */
  export type UserActivityLog$actorArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * UserActivityLog without action
   */
  export type UserActivityLogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserActivityLog
     */
    select?: UserActivityLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserActivityLog
     */
    omit?: UserActivityLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserActivityLogInclude<ExtArgs> | null
  }


  /**
   * Model Job
   */

  export type AggregateJob = {
    _count: JobCountAggregateOutputType | null
    _avg: JobAvgAggregateOutputType | null
    _sum: JobSumAggregateOutputType | null
    _min: JobMinAggregateOutputType | null
    _max: JobMaxAggregateOutputType | null
  }

  export type JobAvgAggregateOutputType = {
    id: number | null
    payAmount: number | null
    lat: number | null
    lng: number | null
    postedById: number | null
  }

  export type JobSumAggregateOutputType = {
    id: number | null
    payAmount: number | null
    lat: number | null
    lng: number | null
    postedById: number | null
  }

  export type JobMinAggregateOutputType = {
    id: number | null
    title: string | null
    type: string | null
    status: string | null
    payAmount: number | null
    lat: number | null
    lng: number | null
    safeZoneReq: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
    postedById: number | null
  }

  export type JobMaxAggregateOutputType = {
    id: number | null
    title: string | null
    type: string | null
    status: string | null
    payAmount: number | null
    lat: number | null
    lng: number | null
    safeZoneReq: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
    postedById: number | null
  }

  export type JobCountAggregateOutputType = {
    id: number
    title: number
    type: number
    status: number
    payAmount: number
    lat: number
    lng: number
    safeZoneReq: number
    createdAt: number
    updatedAt: number
    postedById: number
    _all: number
  }


  export type JobAvgAggregateInputType = {
    id?: true
    payAmount?: true
    lat?: true
    lng?: true
    postedById?: true
  }

  export type JobSumAggregateInputType = {
    id?: true
    payAmount?: true
    lat?: true
    lng?: true
    postedById?: true
  }

  export type JobMinAggregateInputType = {
    id?: true
    title?: true
    type?: true
    status?: true
    payAmount?: true
    lat?: true
    lng?: true
    safeZoneReq?: true
    createdAt?: true
    updatedAt?: true
    postedById?: true
  }

  export type JobMaxAggregateInputType = {
    id?: true
    title?: true
    type?: true
    status?: true
    payAmount?: true
    lat?: true
    lng?: true
    safeZoneReq?: true
    createdAt?: true
    updatedAt?: true
    postedById?: true
  }

  export type JobCountAggregateInputType = {
    id?: true
    title?: true
    type?: true
    status?: true
    payAmount?: true
    lat?: true
    lng?: true
    safeZoneReq?: true
    createdAt?: true
    updatedAt?: true
    postedById?: true
    _all?: true
  }

  export type JobAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Job to aggregate.
     */
    where?: JobWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Jobs to fetch.
     */
    orderBy?: JobOrderByWithRelationInput | JobOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: JobWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Jobs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Jobs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Jobs
    **/
    _count?: true | JobCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: JobAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: JobSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: JobMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: JobMaxAggregateInputType
  }

  export type GetJobAggregateType<T extends JobAggregateArgs> = {
        [P in keyof T & keyof AggregateJob]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateJob[P]>
      : GetScalarType<T[P], AggregateJob[P]>
  }




  export type JobGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: JobWhereInput
    orderBy?: JobOrderByWithAggregationInput | JobOrderByWithAggregationInput[]
    by: JobScalarFieldEnum[] | JobScalarFieldEnum
    having?: JobScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: JobCountAggregateInputType | true
    _avg?: JobAvgAggregateInputType
    _sum?: JobSumAggregateInputType
    _min?: JobMinAggregateInputType
    _max?: JobMaxAggregateInputType
  }

  export type JobGroupByOutputType = {
    id: number
    title: string
    type: string
    status: string
    payAmount: number
    lat: number | null
    lng: number | null
    safeZoneReq: boolean
    createdAt: Date
    updatedAt: Date
    postedById: number | null
    _count: JobCountAggregateOutputType | null
    _avg: JobAvgAggregateOutputType | null
    _sum: JobSumAggregateOutputType | null
    _min: JobMinAggregateOutputType | null
    _max: JobMaxAggregateOutputType | null
  }

  type GetJobGroupByPayload<T extends JobGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<JobGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof JobGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], JobGroupByOutputType[P]>
            : GetScalarType<T[P], JobGroupByOutputType[P]>
        }
      >
    >


  export type JobSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    type?: boolean
    status?: boolean
    payAmount?: boolean
    lat?: boolean
    lng?: boolean
    safeZoneReq?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    postedById?: boolean
    postedBy?: boolean | Job$postedByArgs<ExtArgs>
  }, ExtArgs["result"]["job"]>

  export type JobSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    type?: boolean
    status?: boolean
    payAmount?: boolean
    lat?: boolean
    lng?: boolean
    safeZoneReq?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    postedById?: boolean
    postedBy?: boolean | Job$postedByArgs<ExtArgs>
  }, ExtArgs["result"]["job"]>

  export type JobSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    type?: boolean
    status?: boolean
    payAmount?: boolean
    lat?: boolean
    lng?: boolean
    safeZoneReq?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    postedById?: boolean
    postedBy?: boolean | Job$postedByArgs<ExtArgs>
  }, ExtArgs["result"]["job"]>

  export type JobSelectScalar = {
    id?: boolean
    title?: boolean
    type?: boolean
    status?: boolean
    payAmount?: boolean
    lat?: boolean
    lng?: boolean
    safeZoneReq?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    postedById?: boolean
  }

  export type JobOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "title" | "type" | "status" | "payAmount" | "lat" | "lng" | "safeZoneReq" | "createdAt" | "updatedAt" | "postedById", ExtArgs["result"]["job"]>
  export type JobInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    postedBy?: boolean | Job$postedByArgs<ExtArgs>
  }
  export type JobIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    postedBy?: boolean | Job$postedByArgs<ExtArgs>
  }
  export type JobIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    postedBy?: boolean | Job$postedByArgs<ExtArgs>
  }

  export type $JobPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Job"
    objects: {
      postedBy: Prisma.$UserPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      title: string
      type: string
      status: string
      payAmount: number
      lat: number | null
      lng: number | null
      safeZoneReq: boolean
      createdAt: Date
      updatedAt: Date
      postedById: number | null
    }, ExtArgs["result"]["job"]>
    composites: {}
  }

  type JobGetPayload<S extends boolean | null | undefined | JobDefaultArgs> = $Result.GetResult<Prisma.$JobPayload, S>

  type JobCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<JobFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: JobCountAggregateInputType | true
    }

  export interface JobDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Job'], meta: { name: 'Job' } }
    /**
     * Find zero or one Job that matches the filter.
     * @param {JobFindUniqueArgs} args - Arguments to find a Job
     * @example
     * // Get one Job
     * const job = await prisma.job.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends JobFindUniqueArgs>(args: SelectSubset<T, JobFindUniqueArgs<ExtArgs>>): Prisma__JobClient<$Result.GetResult<Prisma.$JobPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Job that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {JobFindUniqueOrThrowArgs} args - Arguments to find a Job
     * @example
     * // Get one Job
     * const job = await prisma.job.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends JobFindUniqueOrThrowArgs>(args: SelectSubset<T, JobFindUniqueOrThrowArgs<ExtArgs>>): Prisma__JobClient<$Result.GetResult<Prisma.$JobPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Job that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JobFindFirstArgs} args - Arguments to find a Job
     * @example
     * // Get one Job
     * const job = await prisma.job.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends JobFindFirstArgs>(args?: SelectSubset<T, JobFindFirstArgs<ExtArgs>>): Prisma__JobClient<$Result.GetResult<Prisma.$JobPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Job that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JobFindFirstOrThrowArgs} args - Arguments to find a Job
     * @example
     * // Get one Job
     * const job = await prisma.job.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends JobFindFirstOrThrowArgs>(args?: SelectSubset<T, JobFindFirstOrThrowArgs<ExtArgs>>): Prisma__JobClient<$Result.GetResult<Prisma.$JobPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Jobs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JobFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Jobs
     * const jobs = await prisma.job.findMany()
     * 
     * // Get first 10 Jobs
     * const jobs = await prisma.job.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const jobWithIdOnly = await prisma.job.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends JobFindManyArgs>(args?: SelectSubset<T, JobFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$JobPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Job.
     * @param {JobCreateArgs} args - Arguments to create a Job.
     * @example
     * // Create one Job
     * const Job = await prisma.job.create({
     *   data: {
     *     // ... data to create a Job
     *   }
     * })
     * 
     */
    create<T extends JobCreateArgs>(args: SelectSubset<T, JobCreateArgs<ExtArgs>>): Prisma__JobClient<$Result.GetResult<Prisma.$JobPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Jobs.
     * @param {JobCreateManyArgs} args - Arguments to create many Jobs.
     * @example
     * // Create many Jobs
     * const job = await prisma.job.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends JobCreateManyArgs>(args?: SelectSubset<T, JobCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Jobs and returns the data saved in the database.
     * @param {JobCreateManyAndReturnArgs} args - Arguments to create many Jobs.
     * @example
     * // Create many Jobs
     * const job = await prisma.job.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Jobs and only return the `id`
     * const jobWithIdOnly = await prisma.job.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends JobCreateManyAndReturnArgs>(args?: SelectSubset<T, JobCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$JobPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Job.
     * @param {JobDeleteArgs} args - Arguments to delete one Job.
     * @example
     * // Delete one Job
     * const Job = await prisma.job.delete({
     *   where: {
     *     // ... filter to delete one Job
     *   }
     * })
     * 
     */
    delete<T extends JobDeleteArgs>(args: SelectSubset<T, JobDeleteArgs<ExtArgs>>): Prisma__JobClient<$Result.GetResult<Prisma.$JobPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Job.
     * @param {JobUpdateArgs} args - Arguments to update one Job.
     * @example
     * // Update one Job
     * const job = await prisma.job.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends JobUpdateArgs>(args: SelectSubset<T, JobUpdateArgs<ExtArgs>>): Prisma__JobClient<$Result.GetResult<Prisma.$JobPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Jobs.
     * @param {JobDeleteManyArgs} args - Arguments to filter Jobs to delete.
     * @example
     * // Delete a few Jobs
     * const { count } = await prisma.job.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends JobDeleteManyArgs>(args?: SelectSubset<T, JobDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Jobs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JobUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Jobs
     * const job = await prisma.job.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends JobUpdateManyArgs>(args: SelectSubset<T, JobUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Jobs and returns the data updated in the database.
     * @param {JobUpdateManyAndReturnArgs} args - Arguments to update many Jobs.
     * @example
     * // Update many Jobs
     * const job = await prisma.job.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Jobs and only return the `id`
     * const jobWithIdOnly = await prisma.job.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends JobUpdateManyAndReturnArgs>(args: SelectSubset<T, JobUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$JobPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Job.
     * @param {JobUpsertArgs} args - Arguments to update or create a Job.
     * @example
     * // Update or create a Job
     * const job = await prisma.job.upsert({
     *   create: {
     *     // ... data to create a Job
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Job we want to update
     *   }
     * })
     */
    upsert<T extends JobUpsertArgs>(args: SelectSubset<T, JobUpsertArgs<ExtArgs>>): Prisma__JobClient<$Result.GetResult<Prisma.$JobPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Jobs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JobCountArgs} args - Arguments to filter Jobs to count.
     * @example
     * // Count the number of Jobs
     * const count = await prisma.job.count({
     *   where: {
     *     // ... the filter for the Jobs we want to count
     *   }
     * })
    **/
    count<T extends JobCountArgs>(
      args?: Subset<T, JobCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], JobCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Job.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JobAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends JobAggregateArgs>(args: Subset<T, JobAggregateArgs>): Prisma.PrismaPromise<GetJobAggregateType<T>>

    /**
     * Group by Job.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JobGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends JobGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: JobGroupByArgs['orderBy'] }
        : { orderBy?: JobGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, JobGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetJobGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Job model
   */
  readonly fields: JobFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Job.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__JobClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    postedBy<T extends Job$postedByArgs<ExtArgs> = {}>(args?: Subset<T, Job$postedByArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Job model
   */
  interface JobFieldRefs {
    readonly id: FieldRef<"Job", 'Int'>
    readonly title: FieldRef<"Job", 'String'>
    readonly type: FieldRef<"Job", 'String'>
    readonly status: FieldRef<"Job", 'String'>
    readonly payAmount: FieldRef<"Job", 'Int'>
    readonly lat: FieldRef<"Job", 'Float'>
    readonly lng: FieldRef<"Job", 'Float'>
    readonly safeZoneReq: FieldRef<"Job", 'Boolean'>
    readonly createdAt: FieldRef<"Job", 'DateTime'>
    readonly updatedAt: FieldRef<"Job", 'DateTime'>
    readonly postedById: FieldRef<"Job", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * Job findUnique
   */
  export type JobFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Job
     */
    select?: JobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Job
     */
    omit?: JobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobInclude<ExtArgs> | null
    /**
     * Filter, which Job to fetch.
     */
    where: JobWhereUniqueInput
  }

  /**
   * Job findUniqueOrThrow
   */
  export type JobFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Job
     */
    select?: JobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Job
     */
    omit?: JobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobInclude<ExtArgs> | null
    /**
     * Filter, which Job to fetch.
     */
    where: JobWhereUniqueInput
  }

  /**
   * Job findFirst
   */
  export type JobFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Job
     */
    select?: JobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Job
     */
    omit?: JobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobInclude<ExtArgs> | null
    /**
     * Filter, which Job to fetch.
     */
    where?: JobWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Jobs to fetch.
     */
    orderBy?: JobOrderByWithRelationInput | JobOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Jobs.
     */
    cursor?: JobWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Jobs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Jobs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Jobs.
     */
    distinct?: JobScalarFieldEnum | JobScalarFieldEnum[]
  }

  /**
   * Job findFirstOrThrow
   */
  export type JobFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Job
     */
    select?: JobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Job
     */
    omit?: JobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobInclude<ExtArgs> | null
    /**
     * Filter, which Job to fetch.
     */
    where?: JobWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Jobs to fetch.
     */
    orderBy?: JobOrderByWithRelationInput | JobOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Jobs.
     */
    cursor?: JobWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Jobs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Jobs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Jobs.
     */
    distinct?: JobScalarFieldEnum | JobScalarFieldEnum[]
  }

  /**
   * Job findMany
   */
  export type JobFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Job
     */
    select?: JobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Job
     */
    omit?: JobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobInclude<ExtArgs> | null
    /**
     * Filter, which Jobs to fetch.
     */
    where?: JobWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Jobs to fetch.
     */
    orderBy?: JobOrderByWithRelationInput | JobOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Jobs.
     */
    cursor?: JobWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Jobs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Jobs.
     */
    skip?: number
    distinct?: JobScalarFieldEnum | JobScalarFieldEnum[]
  }

  /**
   * Job create
   */
  export type JobCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Job
     */
    select?: JobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Job
     */
    omit?: JobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobInclude<ExtArgs> | null
    /**
     * The data needed to create a Job.
     */
    data: XOR<JobCreateInput, JobUncheckedCreateInput>
  }

  /**
   * Job createMany
   */
  export type JobCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Jobs.
     */
    data: JobCreateManyInput | JobCreateManyInput[]
  }

  /**
   * Job createManyAndReturn
   */
  export type JobCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Job
     */
    select?: JobSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Job
     */
    omit?: JobOmit<ExtArgs> | null
    /**
     * The data used to create many Jobs.
     */
    data: JobCreateManyInput | JobCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Job update
   */
  export type JobUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Job
     */
    select?: JobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Job
     */
    omit?: JobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobInclude<ExtArgs> | null
    /**
     * The data needed to update a Job.
     */
    data: XOR<JobUpdateInput, JobUncheckedUpdateInput>
    /**
     * Choose, which Job to update.
     */
    where: JobWhereUniqueInput
  }

  /**
   * Job updateMany
   */
  export type JobUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Jobs.
     */
    data: XOR<JobUpdateManyMutationInput, JobUncheckedUpdateManyInput>
    /**
     * Filter which Jobs to update
     */
    where?: JobWhereInput
    /**
     * Limit how many Jobs to update.
     */
    limit?: number
  }

  /**
   * Job updateManyAndReturn
   */
  export type JobUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Job
     */
    select?: JobSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Job
     */
    omit?: JobOmit<ExtArgs> | null
    /**
     * The data used to update Jobs.
     */
    data: XOR<JobUpdateManyMutationInput, JobUncheckedUpdateManyInput>
    /**
     * Filter which Jobs to update
     */
    where?: JobWhereInput
    /**
     * Limit how many Jobs to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Job upsert
   */
  export type JobUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Job
     */
    select?: JobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Job
     */
    omit?: JobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobInclude<ExtArgs> | null
    /**
     * The filter to search for the Job to update in case it exists.
     */
    where: JobWhereUniqueInput
    /**
     * In case the Job found by the `where` argument doesn't exist, create a new Job with this data.
     */
    create: XOR<JobCreateInput, JobUncheckedCreateInput>
    /**
     * In case the Job was found with the provided `where` argument, update it with this data.
     */
    update: XOR<JobUpdateInput, JobUncheckedUpdateInput>
  }

  /**
   * Job delete
   */
  export type JobDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Job
     */
    select?: JobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Job
     */
    omit?: JobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobInclude<ExtArgs> | null
    /**
     * Filter which Job to delete.
     */
    where: JobWhereUniqueInput
  }

  /**
   * Job deleteMany
   */
  export type JobDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Jobs to delete
     */
    where?: JobWhereInput
    /**
     * Limit how many Jobs to delete.
     */
    limit?: number
  }

  /**
   * Job.postedBy
   */
  export type Job$postedByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * Job without action
   */
  export type JobDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Job
     */
    select?: JobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Job
     */
    omit?: JobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    phone: 'phone',
    email: 'email',
    role: 'role',
    passwordHash: 'passwordHash',
    managerCode: 'managerCode',
    workStatus: 'workStatus',
    roleRank: 'roleRank',
    googleId: 'googleId',
    facebookId: 'facebookId',
    firstName: 'firstName',
    lastName: 'lastName',
    idCard: 'idCard',
    address: 'address',
    province: 'province',
    district: 'district',
    subDistrict: 'subDistrict',
    zipCode: 'zipCode',
    birthDate: 'birthDate',
    occupation: 'occupation',
    income: 'income',
    education: 'education',
    certificates: 'certificates',
    idCardFront: 'idCardFront',
    idCardBack: 'idCardBack',
    idCardSelfie: 'idCardSelfie',
    faceScan: 'faceScan',
    profileCompleted: 'profileCompleted',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const UserActivityLogScalarFieldEnum: {
    id: 'id',
    action: 'action',
    targetUserId: 'targetUserId',
    targetEmail: 'targetEmail',
    targetRole: 'targetRole',
    actorUserId: 'actorUserId',
    actorEmail: 'actorEmail',
    actorManagerCode: 'actorManagerCode',
    createdAt: 'createdAt'
  };

  export type UserActivityLogScalarFieldEnum = (typeof UserActivityLogScalarFieldEnum)[keyof typeof UserActivityLogScalarFieldEnum]


  export const JobScalarFieldEnum: {
    id: 'id',
    title: 'title',
    type: 'type',
    status: 'status',
    payAmount: 'payAmount',
    lat: 'lat',
    lng: 'lng',
    safeZoneReq: 'safeZoneReq',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    postedById: 'postedById'
  };

  export type JobScalarFieldEnum = (typeof JobScalarFieldEnum)[keyof typeof JobScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: IntFilter<"User"> | number
    phone?: StringNullableFilter<"User"> | string | null
    email?: StringNullableFilter<"User"> | string | null
    role?: StringFilter<"User"> | string
    passwordHash?: StringNullableFilter<"User"> | string | null
    managerCode?: StringNullableFilter<"User"> | string | null
    workStatus?: StringFilter<"User"> | string
    roleRank?: IntFilter<"User"> | number
    googleId?: StringNullableFilter<"User"> | string | null
    facebookId?: StringNullableFilter<"User"> | string | null
    firstName?: StringNullableFilter<"User"> | string | null
    lastName?: StringNullableFilter<"User"> | string | null
    idCard?: StringNullableFilter<"User"> | string | null
    address?: StringNullableFilter<"User"> | string | null
    province?: StringNullableFilter<"User"> | string | null
    district?: StringNullableFilter<"User"> | string | null
    subDistrict?: StringNullableFilter<"User"> | string | null
    zipCode?: StringNullableFilter<"User"> | string | null
    birthDate?: DateTimeNullableFilter<"User"> | Date | string | null
    occupation?: StringNullableFilter<"User"> | string | null
    income?: IntNullableFilter<"User"> | number | null
    education?: StringNullableFilter<"User"> | string | null
    certificates?: StringNullableFilter<"User"> | string | null
    idCardFront?: StringNullableFilter<"User"> | string | null
    idCardBack?: StringNullableFilter<"User"> | string | null
    idCardSelfie?: StringNullableFilter<"User"> | string | null
    faceScan?: StringNullableFilter<"User"> | string | null
    profileCompleted?: BoolFilter<"User"> | boolean
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    jobsPosted?: JobListRelationFilter
    activityLogs?: UserActivityLogListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    phone?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    role?: SortOrder
    passwordHash?: SortOrderInput | SortOrder
    managerCode?: SortOrderInput | SortOrder
    workStatus?: SortOrder
    roleRank?: SortOrder
    googleId?: SortOrderInput | SortOrder
    facebookId?: SortOrderInput | SortOrder
    firstName?: SortOrderInput | SortOrder
    lastName?: SortOrderInput | SortOrder
    idCard?: SortOrderInput | SortOrder
    address?: SortOrderInput | SortOrder
    province?: SortOrderInput | SortOrder
    district?: SortOrderInput | SortOrder
    subDistrict?: SortOrderInput | SortOrder
    zipCode?: SortOrderInput | SortOrder
    birthDate?: SortOrderInput | SortOrder
    occupation?: SortOrderInput | SortOrder
    income?: SortOrderInput | SortOrder
    education?: SortOrderInput | SortOrder
    certificates?: SortOrderInput | SortOrder
    idCardFront?: SortOrderInput | SortOrder
    idCardBack?: SortOrderInput | SortOrder
    idCardSelfie?: SortOrderInput | SortOrder
    faceScan?: SortOrderInput | SortOrder
    profileCompleted?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    jobsPosted?: JobOrderByRelationAggregateInput
    activityLogs?: UserActivityLogOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    phone?: string
    email?: string
    googleId?: string
    facebookId?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    role?: StringFilter<"User"> | string
    passwordHash?: StringNullableFilter<"User"> | string | null
    managerCode?: StringNullableFilter<"User"> | string | null
    workStatus?: StringFilter<"User"> | string
    roleRank?: IntFilter<"User"> | number
    firstName?: StringNullableFilter<"User"> | string | null
    lastName?: StringNullableFilter<"User"> | string | null
    idCard?: StringNullableFilter<"User"> | string | null
    address?: StringNullableFilter<"User"> | string | null
    province?: StringNullableFilter<"User"> | string | null
    district?: StringNullableFilter<"User"> | string | null
    subDistrict?: StringNullableFilter<"User"> | string | null
    zipCode?: StringNullableFilter<"User"> | string | null
    birthDate?: DateTimeNullableFilter<"User"> | Date | string | null
    occupation?: StringNullableFilter<"User"> | string | null
    income?: IntNullableFilter<"User"> | number | null
    education?: StringNullableFilter<"User"> | string | null
    certificates?: StringNullableFilter<"User"> | string | null
    idCardFront?: StringNullableFilter<"User"> | string | null
    idCardBack?: StringNullableFilter<"User"> | string | null
    idCardSelfie?: StringNullableFilter<"User"> | string | null
    faceScan?: StringNullableFilter<"User"> | string | null
    profileCompleted?: BoolFilter<"User"> | boolean
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    jobsPosted?: JobListRelationFilter
    activityLogs?: UserActivityLogListRelationFilter
  }, "id" | "phone" | "email" | "googleId" | "facebookId">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    phone?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    role?: SortOrder
    passwordHash?: SortOrderInput | SortOrder
    managerCode?: SortOrderInput | SortOrder
    workStatus?: SortOrder
    roleRank?: SortOrder
    googleId?: SortOrderInput | SortOrder
    facebookId?: SortOrderInput | SortOrder
    firstName?: SortOrderInput | SortOrder
    lastName?: SortOrderInput | SortOrder
    idCard?: SortOrderInput | SortOrder
    address?: SortOrderInput | SortOrder
    province?: SortOrderInput | SortOrder
    district?: SortOrderInput | SortOrder
    subDistrict?: SortOrderInput | SortOrder
    zipCode?: SortOrderInput | SortOrder
    birthDate?: SortOrderInput | SortOrder
    occupation?: SortOrderInput | SortOrder
    income?: SortOrderInput | SortOrder
    education?: SortOrderInput | SortOrder
    certificates?: SortOrderInput | SortOrder
    idCardFront?: SortOrderInput | SortOrder
    idCardBack?: SortOrderInput | SortOrder
    idCardSelfie?: SortOrderInput | SortOrder
    faceScan?: SortOrderInput | SortOrder
    profileCompleted?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _avg?: UserAvgOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
    _sum?: UserSumOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"User"> | number
    phone?: StringNullableWithAggregatesFilter<"User"> | string | null
    email?: StringNullableWithAggregatesFilter<"User"> | string | null
    role?: StringWithAggregatesFilter<"User"> | string
    passwordHash?: StringNullableWithAggregatesFilter<"User"> | string | null
    managerCode?: StringNullableWithAggregatesFilter<"User"> | string | null
    workStatus?: StringWithAggregatesFilter<"User"> | string
    roleRank?: IntWithAggregatesFilter<"User"> | number
    googleId?: StringNullableWithAggregatesFilter<"User"> | string | null
    facebookId?: StringNullableWithAggregatesFilter<"User"> | string | null
    firstName?: StringNullableWithAggregatesFilter<"User"> | string | null
    lastName?: StringNullableWithAggregatesFilter<"User"> | string | null
    idCard?: StringNullableWithAggregatesFilter<"User"> | string | null
    address?: StringNullableWithAggregatesFilter<"User"> | string | null
    province?: StringNullableWithAggregatesFilter<"User"> | string | null
    district?: StringNullableWithAggregatesFilter<"User"> | string | null
    subDistrict?: StringNullableWithAggregatesFilter<"User"> | string | null
    zipCode?: StringNullableWithAggregatesFilter<"User"> | string | null
    birthDate?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    occupation?: StringNullableWithAggregatesFilter<"User"> | string | null
    income?: IntNullableWithAggregatesFilter<"User"> | number | null
    education?: StringNullableWithAggregatesFilter<"User"> | string | null
    certificates?: StringNullableWithAggregatesFilter<"User"> | string | null
    idCardFront?: StringNullableWithAggregatesFilter<"User"> | string | null
    idCardBack?: StringNullableWithAggregatesFilter<"User"> | string | null
    idCardSelfie?: StringNullableWithAggregatesFilter<"User"> | string | null
    faceScan?: StringNullableWithAggregatesFilter<"User"> | string | null
    profileCompleted?: BoolWithAggregatesFilter<"User"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type UserActivityLogWhereInput = {
    AND?: UserActivityLogWhereInput | UserActivityLogWhereInput[]
    OR?: UserActivityLogWhereInput[]
    NOT?: UserActivityLogWhereInput | UserActivityLogWhereInput[]
    id?: IntFilter<"UserActivityLog"> | number
    action?: StringFilter<"UserActivityLog"> | string
    targetUserId?: IntNullableFilter<"UserActivityLog"> | number | null
    targetEmail?: StringNullableFilter<"UserActivityLog"> | string | null
    targetRole?: StringNullableFilter<"UserActivityLog"> | string | null
    actorUserId?: IntNullableFilter<"UserActivityLog"> | number | null
    actorEmail?: StringNullableFilter<"UserActivityLog"> | string | null
    actorManagerCode?: StringNullableFilter<"UserActivityLog"> | string | null
    createdAt?: DateTimeFilter<"UserActivityLog"> | Date | string
    actor?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }

  export type UserActivityLogOrderByWithRelationInput = {
    id?: SortOrder
    action?: SortOrder
    targetUserId?: SortOrderInput | SortOrder
    targetEmail?: SortOrderInput | SortOrder
    targetRole?: SortOrderInput | SortOrder
    actorUserId?: SortOrderInput | SortOrder
    actorEmail?: SortOrderInput | SortOrder
    actorManagerCode?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    actor?: UserOrderByWithRelationInput
  }

  export type UserActivityLogWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: UserActivityLogWhereInput | UserActivityLogWhereInput[]
    OR?: UserActivityLogWhereInput[]
    NOT?: UserActivityLogWhereInput | UserActivityLogWhereInput[]
    action?: StringFilter<"UserActivityLog"> | string
    targetUserId?: IntNullableFilter<"UserActivityLog"> | number | null
    targetEmail?: StringNullableFilter<"UserActivityLog"> | string | null
    targetRole?: StringNullableFilter<"UserActivityLog"> | string | null
    actorUserId?: IntNullableFilter<"UserActivityLog"> | number | null
    actorEmail?: StringNullableFilter<"UserActivityLog"> | string | null
    actorManagerCode?: StringNullableFilter<"UserActivityLog"> | string | null
    createdAt?: DateTimeFilter<"UserActivityLog"> | Date | string
    actor?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }, "id">

  export type UserActivityLogOrderByWithAggregationInput = {
    id?: SortOrder
    action?: SortOrder
    targetUserId?: SortOrderInput | SortOrder
    targetEmail?: SortOrderInput | SortOrder
    targetRole?: SortOrderInput | SortOrder
    actorUserId?: SortOrderInput | SortOrder
    actorEmail?: SortOrderInput | SortOrder
    actorManagerCode?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: UserActivityLogCountOrderByAggregateInput
    _avg?: UserActivityLogAvgOrderByAggregateInput
    _max?: UserActivityLogMaxOrderByAggregateInput
    _min?: UserActivityLogMinOrderByAggregateInput
    _sum?: UserActivityLogSumOrderByAggregateInput
  }

  export type UserActivityLogScalarWhereWithAggregatesInput = {
    AND?: UserActivityLogScalarWhereWithAggregatesInput | UserActivityLogScalarWhereWithAggregatesInput[]
    OR?: UserActivityLogScalarWhereWithAggregatesInput[]
    NOT?: UserActivityLogScalarWhereWithAggregatesInput | UserActivityLogScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"UserActivityLog"> | number
    action?: StringWithAggregatesFilter<"UserActivityLog"> | string
    targetUserId?: IntNullableWithAggregatesFilter<"UserActivityLog"> | number | null
    targetEmail?: StringNullableWithAggregatesFilter<"UserActivityLog"> | string | null
    targetRole?: StringNullableWithAggregatesFilter<"UserActivityLog"> | string | null
    actorUserId?: IntNullableWithAggregatesFilter<"UserActivityLog"> | number | null
    actorEmail?: StringNullableWithAggregatesFilter<"UserActivityLog"> | string | null
    actorManagerCode?: StringNullableWithAggregatesFilter<"UserActivityLog"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"UserActivityLog"> | Date | string
  }

  export type JobWhereInput = {
    AND?: JobWhereInput | JobWhereInput[]
    OR?: JobWhereInput[]
    NOT?: JobWhereInput | JobWhereInput[]
    id?: IntFilter<"Job"> | number
    title?: StringFilter<"Job"> | string
    type?: StringFilter<"Job"> | string
    status?: StringFilter<"Job"> | string
    payAmount?: IntFilter<"Job"> | number
    lat?: FloatNullableFilter<"Job"> | number | null
    lng?: FloatNullableFilter<"Job"> | number | null
    safeZoneReq?: BoolFilter<"Job"> | boolean
    createdAt?: DateTimeFilter<"Job"> | Date | string
    updatedAt?: DateTimeFilter<"Job"> | Date | string
    postedById?: IntNullableFilter<"Job"> | number | null
    postedBy?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }

  export type JobOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    type?: SortOrder
    status?: SortOrder
    payAmount?: SortOrder
    lat?: SortOrderInput | SortOrder
    lng?: SortOrderInput | SortOrder
    safeZoneReq?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    postedById?: SortOrderInput | SortOrder
    postedBy?: UserOrderByWithRelationInput
  }

  export type JobWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: JobWhereInput | JobWhereInput[]
    OR?: JobWhereInput[]
    NOT?: JobWhereInput | JobWhereInput[]
    title?: StringFilter<"Job"> | string
    type?: StringFilter<"Job"> | string
    status?: StringFilter<"Job"> | string
    payAmount?: IntFilter<"Job"> | number
    lat?: FloatNullableFilter<"Job"> | number | null
    lng?: FloatNullableFilter<"Job"> | number | null
    safeZoneReq?: BoolFilter<"Job"> | boolean
    createdAt?: DateTimeFilter<"Job"> | Date | string
    updatedAt?: DateTimeFilter<"Job"> | Date | string
    postedById?: IntNullableFilter<"Job"> | number | null
    postedBy?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }, "id">

  export type JobOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    type?: SortOrder
    status?: SortOrder
    payAmount?: SortOrder
    lat?: SortOrderInput | SortOrder
    lng?: SortOrderInput | SortOrder
    safeZoneReq?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    postedById?: SortOrderInput | SortOrder
    _count?: JobCountOrderByAggregateInput
    _avg?: JobAvgOrderByAggregateInput
    _max?: JobMaxOrderByAggregateInput
    _min?: JobMinOrderByAggregateInput
    _sum?: JobSumOrderByAggregateInput
  }

  export type JobScalarWhereWithAggregatesInput = {
    AND?: JobScalarWhereWithAggregatesInput | JobScalarWhereWithAggregatesInput[]
    OR?: JobScalarWhereWithAggregatesInput[]
    NOT?: JobScalarWhereWithAggregatesInput | JobScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Job"> | number
    title?: StringWithAggregatesFilter<"Job"> | string
    type?: StringWithAggregatesFilter<"Job"> | string
    status?: StringWithAggregatesFilter<"Job"> | string
    payAmount?: IntWithAggregatesFilter<"Job"> | number
    lat?: FloatNullableWithAggregatesFilter<"Job"> | number | null
    lng?: FloatNullableWithAggregatesFilter<"Job"> | number | null
    safeZoneReq?: BoolWithAggregatesFilter<"Job"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"Job"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Job"> | Date | string
    postedById?: IntNullableWithAggregatesFilter<"Job"> | number | null
  }

  export type UserCreateInput = {
    phone?: string | null
    email?: string | null
    role?: string
    passwordHash?: string | null
    managerCode?: string | null
    workStatus?: string
    roleRank?: number
    googleId?: string | null
    facebookId?: string | null
    firstName?: string | null
    lastName?: string | null
    idCard?: string | null
    address?: string | null
    province?: string | null
    district?: string | null
    subDistrict?: string | null
    zipCode?: string | null
    birthDate?: Date | string | null
    occupation?: string | null
    income?: number | null
    education?: string | null
    certificates?: string | null
    idCardFront?: string | null
    idCardBack?: string | null
    idCardSelfie?: string | null
    faceScan?: string | null
    profileCompleted?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    jobsPosted?: JobCreateNestedManyWithoutPostedByInput
    activityLogs?: UserActivityLogCreateNestedManyWithoutActorInput
  }

  export type UserUncheckedCreateInput = {
    id?: number
    phone?: string | null
    email?: string | null
    role?: string
    passwordHash?: string | null
    managerCode?: string | null
    workStatus?: string
    roleRank?: number
    googleId?: string | null
    facebookId?: string | null
    firstName?: string | null
    lastName?: string | null
    idCard?: string | null
    address?: string | null
    province?: string | null
    district?: string | null
    subDistrict?: string | null
    zipCode?: string | null
    birthDate?: Date | string | null
    occupation?: string | null
    income?: number | null
    education?: string | null
    certificates?: string | null
    idCardFront?: string | null
    idCardBack?: string | null
    idCardSelfie?: string | null
    faceScan?: string | null
    profileCompleted?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    jobsPosted?: JobUncheckedCreateNestedManyWithoutPostedByInput
    activityLogs?: UserActivityLogUncheckedCreateNestedManyWithoutActorInput
  }

  export type UserUpdateInput = {
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    managerCode?: NullableStringFieldUpdateOperationsInput | string | null
    workStatus?: StringFieldUpdateOperationsInput | string
    roleRank?: IntFieldUpdateOperationsInput | number
    googleId?: NullableStringFieldUpdateOperationsInput | string | null
    facebookId?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    idCard?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    province?: NullableStringFieldUpdateOperationsInput | string | null
    district?: NullableStringFieldUpdateOperationsInput | string | null
    subDistrict?: NullableStringFieldUpdateOperationsInput | string | null
    zipCode?: NullableStringFieldUpdateOperationsInput | string | null
    birthDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    occupation?: NullableStringFieldUpdateOperationsInput | string | null
    income?: NullableIntFieldUpdateOperationsInput | number | null
    education?: NullableStringFieldUpdateOperationsInput | string | null
    certificates?: NullableStringFieldUpdateOperationsInput | string | null
    idCardFront?: NullableStringFieldUpdateOperationsInput | string | null
    idCardBack?: NullableStringFieldUpdateOperationsInput | string | null
    idCardSelfie?: NullableStringFieldUpdateOperationsInput | string | null
    faceScan?: NullableStringFieldUpdateOperationsInput | string | null
    profileCompleted?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    jobsPosted?: JobUpdateManyWithoutPostedByNestedInput
    activityLogs?: UserActivityLogUpdateManyWithoutActorNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    managerCode?: NullableStringFieldUpdateOperationsInput | string | null
    workStatus?: StringFieldUpdateOperationsInput | string
    roleRank?: IntFieldUpdateOperationsInput | number
    googleId?: NullableStringFieldUpdateOperationsInput | string | null
    facebookId?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    idCard?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    province?: NullableStringFieldUpdateOperationsInput | string | null
    district?: NullableStringFieldUpdateOperationsInput | string | null
    subDistrict?: NullableStringFieldUpdateOperationsInput | string | null
    zipCode?: NullableStringFieldUpdateOperationsInput | string | null
    birthDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    occupation?: NullableStringFieldUpdateOperationsInput | string | null
    income?: NullableIntFieldUpdateOperationsInput | number | null
    education?: NullableStringFieldUpdateOperationsInput | string | null
    certificates?: NullableStringFieldUpdateOperationsInput | string | null
    idCardFront?: NullableStringFieldUpdateOperationsInput | string | null
    idCardBack?: NullableStringFieldUpdateOperationsInput | string | null
    idCardSelfie?: NullableStringFieldUpdateOperationsInput | string | null
    faceScan?: NullableStringFieldUpdateOperationsInput | string | null
    profileCompleted?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    jobsPosted?: JobUncheckedUpdateManyWithoutPostedByNestedInput
    activityLogs?: UserActivityLogUncheckedUpdateManyWithoutActorNestedInput
  }

  export type UserCreateManyInput = {
    id?: number
    phone?: string | null
    email?: string | null
    role?: string
    passwordHash?: string | null
    managerCode?: string | null
    workStatus?: string
    roleRank?: number
    googleId?: string | null
    facebookId?: string | null
    firstName?: string | null
    lastName?: string | null
    idCard?: string | null
    address?: string | null
    province?: string | null
    district?: string | null
    subDistrict?: string | null
    zipCode?: string | null
    birthDate?: Date | string | null
    occupation?: string | null
    income?: number | null
    education?: string | null
    certificates?: string | null
    idCardFront?: string | null
    idCardBack?: string | null
    idCardSelfie?: string | null
    faceScan?: string | null
    profileCompleted?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    managerCode?: NullableStringFieldUpdateOperationsInput | string | null
    workStatus?: StringFieldUpdateOperationsInput | string
    roleRank?: IntFieldUpdateOperationsInput | number
    googleId?: NullableStringFieldUpdateOperationsInput | string | null
    facebookId?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    idCard?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    province?: NullableStringFieldUpdateOperationsInput | string | null
    district?: NullableStringFieldUpdateOperationsInput | string | null
    subDistrict?: NullableStringFieldUpdateOperationsInput | string | null
    zipCode?: NullableStringFieldUpdateOperationsInput | string | null
    birthDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    occupation?: NullableStringFieldUpdateOperationsInput | string | null
    income?: NullableIntFieldUpdateOperationsInput | number | null
    education?: NullableStringFieldUpdateOperationsInput | string | null
    certificates?: NullableStringFieldUpdateOperationsInput | string | null
    idCardFront?: NullableStringFieldUpdateOperationsInput | string | null
    idCardBack?: NullableStringFieldUpdateOperationsInput | string | null
    idCardSelfie?: NullableStringFieldUpdateOperationsInput | string | null
    faceScan?: NullableStringFieldUpdateOperationsInput | string | null
    profileCompleted?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    managerCode?: NullableStringFieldUpdateOperationsInput | string | null
    workStatus?: StringFieldUpdateOperationsInput | string
    roleRank?: IntFieldUpdateOperationsInput | number
    googleId?: NullableStringFieldUpdateOperationsInput | string | null
    facebookId?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    idCard?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    province?: NullableStringFieldUpdateOperationsInput | string | null
    district?: NullableStringFieldUpdateOperationsInput | string | null
    subDistrict?: NullableStringFieldUpdateOperationsInput | string | null
    zipCode?: NullableStringFieldUpdateOperationsInput | string | null
    birthDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    occupation?: NullableStringFieldUpdateOperationsInput | string | null
    income?: NullableIntFieldUpdateOperationsInput | number | null
    education?: NullableStringFieldUpdateOperationsInput | string | null
    certificates?: NullableStringFieldUpdateOperationsInput | string | null
    idCardFront?: NullableStringFieldUpdateOperationsInput | string | null
    idCardBack?: NullableStringFieldUpdateOperationsInput | string | null
    idCardSelfie?: NullableStringFieldUpdateOperationsInput | string | null
    faceScan?: NullableStringFieldUpdateOperationsInput | string | null
    profileCompleted?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserActivityLogCreateInput = {
    action: string
    targetUserId?: number | null
    targetEmail?: string | null
    targetRole?: string | null
    actorEmail?: string | null
    actorManagerCode?: string | null
    createdAt?: Date | string
    actor?: UserCreateNestedOneWithoutActivityLogsInput
  }

  export type UserActivityLogUncheckedCreateInput = {
    id?: number
    action: string
    targetUserId?: number | null
    targetEmail?: string | null
    targetRole?: string | null
    actorUserId?: number | null
    actorEmail?: string | null
    actorManagerCode?: string | null
    createdAt?: Date | string
  }

  export type UserActivityLogUpdateInput = {
    action?: StringFieldUpdateOperationsInput | string
    targetUserId?: NullableIntFieldUpdateOperationsInput | number | null
    targetEmail?: NullableStringFieldUpdateOperationsInput | string | null
    targetRole?: NullableStringFieldUpdateOperationsInput | string | null
    actorEmail?: NullableStringFieldUpdateOperationsInput | string | null
    actorManagerCode?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    actor?: UserUpdateOneWithoutActivityLogsNestedInput
  }

  export type UserActivityLogUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    action?: StringFieldUpdateOperationsInput | string
    targetUserId?: NullableIntFieldUpdateOperationsInput | number | null
    targetEmail?: NullableStringFieldUpdateOperationsInput | string | null
    targetRole?: NullableStringFieldUpdateOperationsInput | string | null
    actorUserId?: NullableIntFieldUpdateOperationsInput | number | null
    actorEmail?: NullableStringFieldUpdateOperationsInput | string | null
    actorManagerCode?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserActivityLogCreateManyInput = {
    id?: number
    action: string
    targetUserId?: number | null
    targetEmail?: string | null
    targetRole?: string | null
    actorUserId?: number | null
    actorEmail?: string | null
    actorManagerCode?: string | null
    createdAt?: Date | string
  }

  export type UserActivityLogUpdateManyMutationInput = {
    action?: StringFieldUpdateOperationsInput | string
    targetUserId?: NullableIntFieldUpdateOperationsInput | number | null
    targetEmail?: NullableStringFieldUpdateOperationsInput | string | null
    targetRole?: NullableStringFieldUpdateOperationsInput | string | null
    actorEmail?: NullableStringFieldUpdateOperationsInput | string | null
    actorManagerCode?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserActivityLogUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    action?: StringFieldUpdateOperationsInput | string
    targetUserId?: NullableIntFieldUpdateOperationsInput | number | null
    targetEmail?: NullableStringFieldUpdateOperationsInput | string | null
    targetRole?: NullableStringFieldUpdateOperationsInput | string | null
    actorUserId?: NullableIntFieldUpdateOperationsInput | number | null
    actorEmail?: NullableStringFieldUpdateOperationsInput | string | null
    actorManagerCode?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type JobCreateInput = {
    title: string
    type: string
    status?: string
    payAmount: number
    lat?: number | null
    lng?: number | null
    safeZoneReq?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    postedBy?: UserCreateNestedOneWithoutJobsPostedInput
  }

  export type JobUncheckedCreateInput = {
    id?: number
    title: string
    type: string
    status?: string
    payAmount: number
    lat?: number | null
    lng?: number | null
    safeZoneReq?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    postedById?: number | null
  }

  export type JobUpdateInput = {
    title?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    payAmount?: IntFieldUpdateOperationsInput | number
    lat?: NullableFloatFieldUpdateOperationsInput | number | null
    lng?: NullableFloatFieldUpdateOperationsInput | number | null
    safeZoneReq?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    postedBy?: UserUpdateOneWithoutJobsPostedNestedInput
  }

  export type JobUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    payAmount?: IntFieldUpdateOperationsInput | number
    lat?: NullableFloatFieldUpdateOperationsInput | number | null
    lng?: NullableFloatFieldUpdateOperationsInput | number | null
    safeZoneReq?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    postedById?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type JobCreateManyInput = {
    id?: number
    title: string
    type: string
    status?: string
    payAmount: number
    lat?: number | null
    lng?: number | null
    safeZoneReq?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    postedById?: number | null
  }

  export type JobUpdateManyMutationInput = {
    title?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    payAmount?: IntFieldUpdateOperationsInput | number
    lat?: NullableFloatFieldUpdateOperationsInput | number | null
    lng?: NullableFloatFieldUpdateOperationsInput | number | null
    safeZoneReq?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type JobUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    payAmount?: IntFieldUpdateOperationsInput | number
    lat?: NullableFloatFieldUpdateOperationsInput | number | null
    lng?: NullableFloatFieldUpdateOperationsInput | number | null
    safeZoneReq?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    postedById?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type JobListRelationFilter = {
    every?: JobWhereInput
    some?: JobWhereInput
    none?: JobWhereInput
  }

  export type UserActivityLogListRelationFilter = {
    every?: UserActivityLogWhereInput
    some?: UserActivityLogWhereInput
    none?: UserActivityLogWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type JobOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserActivityLogOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    phone?: SortOrder
    email?: SortOrder
    role?: SortOrder
    passwordHash?: SortOrder
    managerCode?: SortOrder
    workStatus?: SortOrder
    roleRank?: SortOrder
    googleId?: SortOrder
    facebookId?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    idCard?: SortOrder
    address?: SortOrder
    province?: SortOrder
    district?: SortOrder
    subDistrict?: SortOrder
    zipCode?: SortOrder
    birthDate?: SortOrder
    occupation?: SortOrder
    income?: SortOrder
    education?: SortOrder
    certificates?: SortOrder
    idCardFront?: SortOrder
    idCardBack?: SortOrder
    idCardSelfie?: SortOrder
    faceScan?: SortOrder
    profileCompleted?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserAvgOrderByAggregateInput = {
    id?: SortOrder
    roleRank?: SortOrder
    income?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    phone?: SortOrder
    email?: SortOrder
    role?: SortOrder
    passwordHash?: SortOrder
    managerCode?: SortOrder
    workStatus?: SortOrder
    roleRank?: SortOrder
    googleId?: SortOrder
    facebookId?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    idCard?: SortOrder
    address?: SortOrder
    province?: SortOrder
    district?: SortOrder
    subDistrict?: SortOrder
    zipCode?: SortOrder
    birthDate?: SortOrder
    occupation?: SortOrder
    income?: SortOrder
    education?: SortOrder
    certificates?: SortOrder
    idCardFront?: SortOrder
    idCardBack?: SortOrder
    idCardSelfie?: SortOrder
    faceScan?: SortOrder
    profileCompleted?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    phone?: SortOrder
    email?: SortOrder
    role?: SortOrder
    passwordHash?: SortOrder
    managerCode?: SortOrder
    workStatus?: SortOrder
    roleRank?: SortOrder
    googleId?: SortOrder
    facebookId?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    idCard?: SortOrder
    address?: SortOrder
    province?: SortOrder
    district?: SortOrder
    subDistrict?: SortOrder
    zipCode?: SortOrder
    birthDate?: SortOrder
    occupation?: SortOrder
    income?: SortOrder
    education?: SortOrder
    certificates?: SortOrder
    idCardFront?: SortOrder
    idCardBack?: SortOrder
    idCardSelfie?: SortOrder
    faceScan?: SortOrder
    profileCompleted?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserSumOrderByAggregateInput = {
    id?: SortOrder
    roleRank?: SortOrder
    income?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type UserNullableScalarRelationFilter = {
    is?: UserWhereInput | null
    isNot?: UserWhereInput | null
  }

  export type UserActivityLogCountOrderByAggregateInput = {
    id?: SortOrder
    action?: SortOrder
    targetUserId?: SortOrder
    targetEmail?: SortOrder
    targetRole?: SortOrder
    actorUserId?: SortOrder
    actorEmail?: SortOrder
    actorManagerCode?: SortOrder
    createdAt?: SortOrder
  }

  export type UserActivityLogAvgOrderByAggregateInput = {
    id?: SortOrder
    targetUserId?: SortOrder
    actorUserId?: SortOrder
  }

  export type UserActivityLogMaxOrderByAggregateInput = {
    id?: SortOrder
    action?: SortOrder
    targetUserId?: SortOrder
    targetEmail?: SortOrder
    targetRole?: SortOrder
    actorUserId?: SortOrder
    actorEmail?: SortOrder
    actorManagerCode?: SortOrder
    createdAt?: SortOrder
  }

  export type UserActivityLogMinOrderByAggregateInput = {
    id?: SortOrder
    action?: SortOrder
    targetUserId?: SortOrder
    targetEmail?: SortOrder
    targetRole?: SortOrder
    actorUserId?: SortOrder
    actorEmail?: SortOrder
    actorManagerCode?: SortOrder
    createdAt?: SortOrder
  }

  export type UserActivityLogSumOrderByAggregateInput = {
    id?: SortOrder
    targetUserId?: SortOrder
    actorUserId?: SortOrder
  }

  export type FloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type JobCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    type?: SortOrder
    status?: SortOrder
    payAmount?: SortOrder
    lat?: SortOrder
    lng?: SortOrder
    safeZoneReq?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    postedById?: SortOrder
  }

  export type JobAvgOrderByAggregateInput = {
    id?: SortOrder
    payAmount?: SortOrder
    lat?: SortOrder
    lng?: SortOrder
    postedById?: SortOrder
  }

  export type JobMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    type?: SortOrder
    status?: SortOrder
    payAmount?: SortOrder
    lat?: SortOrder
    lng?: SortOrder
    safeZoneReq?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    postedById?: SortOrder
  }

  export type JobMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    type?: SortOrder
    status?: SortOrder
    payAmount?: SortOrder
    lat?: SortOrder
    lng?: SortOrder
    safeZoneReq?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    postedById?: SortOrder
  }

  export type JobSumOrderByAggregateInput = {
    id?: SortOrder
    payAmount?: SortOrder
    lat?: SortOrder
    lng?: SortOrder
    postedById?: SortOrder
  }

  export type FloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type JobCreateNestedManyWithoutPostedByInput = {
    create?: XOR<JobCreateWithoutPostedByInput, JobUncheckedCreateWithoutPostedByInput> | JobCreateWithoutPostedByInput[] | JobUncheckedCreateWithoutPostedByInput[]
    connectOrCreate?: JobCreateOrConnectWithoutPostedByInput | JobCreateOrConnectWithoutPostedByInput[]
    createMany?: JobCreateManyPostedByInputEnvelope
    connect?: JobWhereUniqueInput | JobWhereUniqueInput[]
  }

  export type UserActivityLogCreateNestedManyWithoutActorInput = {
    create?: XOR<UserActivityLogCreateWithoutActorInput, UserActivityLogUncheckedCreateWithoutActorInput> | UserActivityLogCreateWithoutActorInput[] | UserActivityLogUncheckedCreateWithoutActorInput[]
    connectOrCreate?: UserActivityLogCreateOrConnectWithoutActorInput | UserActivityLogCreateOrConnectWithoutActorInput[]
    createMany?: UserActivityLogCreateManyActorInputEnvelope
    connect?: UserActivityLogWhereUniqueInput | UserActivityLogWhereUniqueInput[]
  }

  export type JobUncheckedCreateNestedManyWithoutPostedByInput = {
    create?: XOR<JobCreateWithoutPostedByInput, JobUncheckedCreateWithoutPostedByInput> | JobCreateWithoutPostedByInput[] | JobUncheckedCreateWithoutPostedByInput[]
    connectOrCreate?: JobCreateOrConnectWithoutPostedByInput | JobCreateOrConnectWithoutPostedByInput[]
    createMany?: JobCreateManyPostedByInputEnvelope
    connect?: JobWhereUniqueInput | JobWhereUniqueInput[]
  }

  export type UserActivityLogUncheckedCreateNestedManyWithoutActorInput = {
    create?: XOR<UserActivityLogCreateWithoutActorInput, UserActivityLogUncheckedCreateWithoutActorInput> | UserActivityLogCreateWithoutActorInput[] | UserActivityLogUncheckedCreateWithoutActorInput[]
    connectOrCreate?: UserActivityLogCreateOrConnectWithoutActorInput | UserActivityLogCreateOrConnectWithoutActorInput[]
    createMany?: UserActivityLogCreateManyActorInputEnvelope
    connect?: UserActivityLogWhereUniqueInput | UserActivityLogWhereUniqueInput[]
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type JobUpdateManyWithoutPostedByNestedInput = {
    create?: XOR<JobCreateWithoutPostedByInput, JobUncheckedCreateWithoutPostedByInput> | JobCreateWithoutPostedByInput[] | JobUncheckedCreateWithoutPostedByInput[]
    connectOrCreate?: JobCreateOrConnectWithoutPostedByInput | JobCreateOrConnectWithoutPostedByInput[]
    upsert?: JobUpsertWithWhereUniqueWithoutPostedByInput | JobUpsertWithWhereUniqueWithoutPostedByInput[]
    createMany?: JobCreateManyPostedByInputEnvelope
    set?: JobWhereUniqueInput | JobWhereUniqueInput[]
    disconnect?: JobWhereUniqueInput | JobWhereUniqueInput[]
    delete?: JobWhereUniqueInput | JobWhereUniqueInput[]
    connect?: JobWhereUniqueInput | JobWhereUniqueInput[]
    update?: JobUpdateWithWhereUniqueWithoutPostedByInput | JobUpdateWithWhereUniqueWithoutPostedByInput[]
    updateMany?: JobUpdateManyWithWhereWithoutPostedByInput | JobUpdateManyWithWhereWithoutPostedByInput[]
    deleteMany?: JobScalarWhereInput | JobScalarWhereInput[]
  }

  export type UserActivityLogUpdateManyWithoutActorNestedInput = {
    create?: XOR<UserActivityLogCreateWithoutActorInput, UserActivityLogUncheckedCreateWithoutActorInput> | UserActivityLogCreateWithoutActorInput[] | UserActivityLogUncheckedCreateWithoutActorInput[]
    connectOrCreate?: UserActivityLogCreateOrConnectWithoutActorInput | UserActivityLogCreateOrConnectWithoutActorInput[]
    upsert?: UserActivityLogUpsertWithWhereUniqueWithoutActorInput | UserActivityLogUpsertWithWhereUniqueWithoutActorInput[]
    createMany?: UserActivityLogCreateManyActorInputEnvelope
    set?: UserActivityLogWhereUniqueInput | UserActivityLogWhereUniqueInput[]
    disconnect?: UserActivityLogWhereUniqueInput | UserActivityLogWhereUniqueInput[]
    delete?: UserActivityLogWhereUniqueInput | UserActivityLogWhereUniqueInput[]
    connect?: UserActivityLogWhereUniqueInput | UserActivityLogWhereUniqueInput[]
    update?: UserActivityLogUpdateWithWhereUniqueWithoutActorInput | UserActivityLogUpdateWithWhereUniqueWithoutActorInput[]
    updateMany?: UserActivityLogUpdateManyWithWhereWithoutActorInput | UserActivityLogUpdateManyWithWhereWithoutActorInput[]
    deleteMany?: UserActivityLogScalarWhereInput | UserActivityLogScalarWhereInput[]
  }

  export type JobUncheckedUpdateManyWithoutPostedByNestedInput = {
    create?: XOR<JobCreateWithoutPostedByInput, JobUncheckedCreateWithoutPostedByInput> | JobCreateWithoutPostedByInput[] | JobUncheckedCreateWithoutPostedByInput[]
    connectOrCreate?: JobCreateOrConnectWithoutPostedByInput | JobCreateOrConnectWithoutPostedByInput[]
    upsert?: JobUpsertWithWhereUniqueWithoutPostedByInput | JobUpsertWithWhereUniqueWithoutPostedByInput[]
    createMany?: JobCreateManyPostedByInputEnvelope
    set?: JobWhereUniqueInput | JobWhereUniqueInput[]
    disconnect?: JobWhereUniqueInput | JobWhereUniqueInput[]
    delete?: JobWhereUniqueInput | JobWhereUniqueInput[]
    connect?: JobWhereUniqueInput | JobWhereUniqueInput[]
    update?: JobUpdateWithWhereUniqueWithoutPostedByInput | JobUpdateWithWhereUniqueWithoutPostedByInput[]
    updateMany?: JobUpdateManyWithWhereWithoutPostedByInput | JobUpdateManyWithWhereWithoutPostedByInput[]
    deleteMany?: JobScalarWhereInput | JobScalarWhereInput[]
  }

  export type UserActivityLogUncheckedUpdateManyWithoutActorNestedInput = {
    create?: XOR<UserActivityLogCreateWithoutActorInput, UserActivityLogUncheckedCreateWithoutActorInput> | UserActivityLogCreateWithoutActorInput[] | UserActivityLogUncheckedCreateWithoutActorInput[]
    connectOrCreate?: UserActivityLogCreateOrConnectWithoutActorInput | UserActivityLogCreateOrConnectWithoutActorInput[]
    upsert?: UserActivityLogUpsertWithWhereUniqueWithoutActorInput | UserActivityLogUpsertWithWhereUniqueWithoutActorInput[]
    createMany?: UserActivityLogCreateManyActorInputEnvelope
    set?: UserActivityLogWhereUniqueInput | UserActivityLogWhereUniqueInput[]
    disconnect?: UserActivityLogWhereUniqueInput | UserActivityLogWhereUniqueInput[]
    delete?: UserActivityLogWhereUniqueInput | UserActivityLogWhereUniqueInput[]
    connect?: UserActivityLogWhereUniqueInput | UserActivityLogWhereUniqueInput[]
    update?: UserActivityLogUpdateWithWhereUniqueWithoutActorInput | UserActivityLogUpdateWithWhereUniqueWithoutActorInput[]
    updateMany?: UserActivityLogUpdateManyWithWhereWithoutActorInput | UserActivityLogUpdateManyWithWhereWithoutActorInput[]
    deleteMany?: UserActivityLogScalarWhereInput | UserActivityLogScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutActivityLogsInput = {
    create?: XOR<UserCreateWithoutActivityLogsInput, UserUncheckedCreateWithoutActivityLogsInput>
    connectOrCreate?: UserCreateOrConnectWithoutActivityLogsInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneWithoutActivityLogsNestedInput = {
    create?: XOR<UserCreateWithoutActivityLogsInput, UserUncheckedCreateWithoutActivityLogsInput>
    connectOrCreate?: UserCreateOrConnectWithoutActivityLogsInput
    upsert?: UserUpsertWithoutActivityLogsInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutActivityLogsInput, UserUpdateWithoutActivityLogsInput>, UserUncheckedUpdateWithoutActivityLogsInput>
  }

  export type UserCreateNestedOneWithoutJobsPostedInput = {
    create?: XOR<UserCreateWithoutJobsPostedInput, UserUncheckedCreateWithoutJobsPostedInput>
    connectOrCreate?: UserCreateOrConnectWithoutJobsPostedInput
    connect?: UserWhereUniqueInput
  }

  export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type UserUpdateOneWithoutJobsPostedNestedInput = {
    create?: XOR<UserCreateWithoutJobsPostedInput, UserUncheckedCreateWithoutJobsPostedInput>
    connectOrCreate?: UserCreateOrConnectWithoutJobsPostedInput
    upsert?: UserUpsertWithoutJobsPostedInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutJobsPostedInput, UserUpdateWithoutJobsPostedInput>, UserUncheckedUpdateWithoutJobsPostedInput>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedFloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type JobCreateWithoutPostedByInput = {
    title: string
    type: string
    status?: string
    payAmount: number
    lat?: number | null
    lng?: number | null
    safeZoneReq?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type JobUncheckedCreateWithoutPostedByInput = {
    id?: number
    title: string
    type: string
    status?: string
    payAmount: number
    lat?: number | null
    lng?: number | null
    safeZoneReq?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type JobCreateOrConnectWithoutPostedByInput = {
    where: JobWhereUniqueInput
    create: XOR<JobCreateWithoutPostedByInput, JobUncheckedCreateWithoutPostedByInput>
  }

  export type JobCreateManyPostedByInputEnvelope = {
    data: JobCreateManyPostedByInput | JobCreateManyPostedByInput[]
  }

  export type UserActivityLogCreateWithoutActorInput = {
    action: string
    targetUserId?: number | null
    targetEmail?: string | null
    targetRole?: string | null
    actorEmail?: string | null
    actorManagerCode?: string | null
    createdAt?: Date | string
  }

  export type UserActivityLogUncheckedCreateWithoutActorInput = {
    id?: number
    action: string
    targetUserId?: number | null
    targetEmail?: string | null
    targetRole?: string | null
    actorEmail?: string | null
    actorManagerCode?: string | null
    createdAt?: Date | string
  }

  export type UserActivityLogCreateOrConnectWithoutActorInput = {
    where: UserActivityLogWhereUniqueInput
    create: XOR<UserActivityLogCreateWithoutActorInput, UserActivityLogUncheckedCreateWithoutActorInput>
  }

  export type UserActivityLogCreateManyActorInputEnvelope = {
    data: UserActivityLogCreateManyActorInput | UserActivityLogCreateManyActorInput[]
  }

  export type JobUpsertWithWhereUniqueWithoutPostedByInput = {
    where: JobWhereUniqueInput
    update: XOR<JobUpdateWithoutPostedByInput, JobUncheckedUpdateWithoutPostedByInput>
    create: XOR<JobCreateWithoutPostedByInput, JobUncheckedCreateWithoutPostedByInput>
  }

  export type JobUpdateWithWhereUniqueWithoutPostedByInput = {
    where: JobWhereUniqueInput
    data: XOR<JobUpdateWithoutPostedByInput, JobUncheckedUpdateWithoutPostedByInput>
  }

  export type JobUpdateManyWithWhereWithoutPostedByInput = {
    where: JobScalarWhereInput
    data: XOR<JobUpdateManyMutationInput, JobUncheckedUpdateManyWithoutPostedByInput>
  }

  export type JobScalarWhereInput = {
    AND?: JobScalarWhereInput | JobScalarWhereInput[]
    OR?: JobScalarWhereInput[]
    NOT?: JobScalarWhereInput | JobScalarWhereInput[]
    id?: IntFilter<"Job"> | number
    title?: StringFilter<"Job"> | string
    type?: StringFilter<"Job"> | string
    status?: StringFilter<"Job"> | string
    payAmount?: IntFilter<"Job"> | number
    lat?: FloatNullableFilter<"Job"> | number | null
    lng?: FloatNullableFilter<"Job"> | number | null
    safeZoneReq?: BoolFilter<"Job"> | boolean
    createdAt?: DateTimeFilter<"Job"> | Date | string
    updatedAt?: DateTimeFilter<"Job"> | Date | string
    postedById?: IntNullableFilter<"Job"> | number | null
  }

  export type UserActivityLogUpsertWithWhereUniqueWithoutActorInput = {
    where: UserActivityLogWhereUniqueInput
    update: XOR<UserActivityLogUpdateWithoutActorInput, UserActivityLogUncheckedUpdateWithoutActorInput>
    create: XOR<UserActivityLogCreateWithoutActorInput, UserActivityLogUncheckedCreateWithoutActorInput>
  }

  export type UserActivityLogUpdateWithWhereUniqueWithoutActorInput = {
    where: UserActivityLogWhereUniqueInput
    data: XOR<UserActivityLogUpdateWithoutActorInput, UserActivityLogUncheckedUpdateWithoutActorInput>
  }

  export type UserActivityLogUpdateManyWithWhereWithoutActorInput = {
    where: UserActivityLogScalarWhereInput
    data: XOR<UserActivityLogUpdateManyMutationInput, UserActivityLogUncheckedUpdateManyWithoutActorInput>
  }

  export type UserActivityLogScalarWhereInput = {
    AND?: UserActivityLogScalarWhereInput | UserActivityLogScalarWhereInput[]
    OR?: UserActivityLogScalarWhereInput[]
    NOT?: UserActivityLogScalarWhereInput | UserActivityLogScalarWhereInput[]
    id?: IntFilter<"UserActivityLog"> | number
    action?: StringFilter<"UserActivityLog"> | string
    targetUserId?: IntNullableFilter<"UserActivityLog"> | number | null
    targetEmail?: StringNullableFilter<"UserActivityLog"> | string | null
    targetRole?: StringNullableFilter<"UserActivityLog"> | string | null
    actorUserId?: IntNullableFilter<"UserActivityLog"> | number | null
    actorEmail?: StringNullableFilter<"UserActivityLog"> | string | null
    actorManagerCode?: StringNullableFilter<"UserActivityLog"> | string | null
    createdAt?: DateTimeFilter<"UserActivityLog"> | Date | string
  }

  export type UserCreateWithoutActivityLogsInput = {
    phone?: string | null
    email?: string | null
    role?: string
    passwordHash?: string | null
    managerCode?: string | null
    workStatus?: string
    roleRank?: number
    googleId?: string | null
    facebookId?: string | null
    firstName?: string | null
    lastName?: string | null
    idCard?: string | null
    address?: string | null
    province?: string | null
    district?: string | null
    subDistrict?: string | null
    zipCode?: string | null
    birthDate?: Date | string | null
    occupation?: string | null
    income?: number | null
    education?: string | null
    certificates?: string | null
    idCardFront?: string | null
    idCardBack?: string | null
    idCardSelfie?: string | null
    faceScan?: string | null
    profileCompleted?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    jobsPosted?: JobCreateNestedManyWithoutPostedByInput
  }

  export type UserUncheckedCreateWithoutActivityLogsInput = {
    id?: number
    phone?: string | null
    email?: string | null
    role?: string
    passwordHash?: string | null
    managerCode?: string | null
    workStatus?: string
    roleRank?: number
    googleId?: string | null
    facebookId?: string | null
    firstName?: string | null
    lastName?: string | null
    idCard?: string | null
    address?: string | null
    province?: string | null
    district?: string | null
    subDistrict?: string | null
    zipCode?: string | null
    birthDate?: Date | string | null
    occupation?: string | null
    income?: number | null
    education?: string | null
    certificates?: string | null
    idCardFront?: string | null
    idCardBack?: string | null
    idCardSelfie?: string | null
    faceScan?: string | null
    profileCompleted?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    jobsPosted?: JobUncheckedCreateNestedManyWithoutPostedByInput
  }

  export type UserCreateOrConnectWithoutActivityLogsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutActivityLogsInput, UserUncheckedCreateWithoutActivityLogsInput>
  }

  export type UserUpsertWithoutActivityLogsInput = {
    update: XOR<UserUpdateWithoutActivityLogsInput, UserUncheckedUpdateWithoutActivityLogsInput>
    create: XOR<UserCreateWithoutActivityLogsInput, UserUncheckedCreateWithoutActivityLogsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutActivityLogsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutActivityLogsInput, UserUncheckedUpdateWithoutActivityLogsInput>
  }

  export type UserUpdateWithoutActivityLogsInput = {
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    managerCode?: NullableStringFieldUpdateOperationsInput | string | null
    workStatus?: StringFieldUpdateOperationsInput | string
    roleRank?: IntFieldUpdateOperationsInput | number
    googleId?: NullableStringFieldUpdateOperationsInput | string | null
    facebookId?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    idCard?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    province?: NullableStringFieldUpdateOperationsInput | string | null
    district?: NullableStringFieldUpdateOperationsInput | string | null
    subDistrict?: NullableStringFieldUpdateOperationsInput | string | null
    zipCode?: NullableStringFieldUpdateOperationsInput | string | null
    birthDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    occupation?: NullableStringFieldUpdateOperationsInput | string | null
    income?: NullableIntFieldUpdateOperationsInput | number | null
    education?: NullableStringFieldUpdateOperationsInput | string | null
    certificates?: NullableStringFieldUpdateOperationsInput | string | null
    idCardFront?: NullableStringFieldUpdateOperationsInput | string | null
    idCardBack?: NullableStringFieldUpdateOperationsInput | string | null
    idCardSelfie?: NullableStringFieldUpdateOperationsInput | string | null
    faceScan?: NullableStringFieldUpdateOperationsInput | string | null
    profileCompleted?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    jobsPosted?: JobUpdateManyWithoutPostedByNestedInput
  }

  export type UserUncheckedUpdateWithoutActivityLogsInput = {
    id?: IntFieldUpdateOperationsInput | number
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    managerCode?: NullableStringFieldUpdateOperationsInput | string | null
    workStatus?: StringFieldUpdateOperationsInput | string
    roleRank?: IntFieldUpdateOperationsInput | number
    googleId?: NullableStringFieldUpdateOperationsInput | string | null
    facebookId?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    idCard?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    province?: NullableStringFieldUpdateOperationsInput | string | null
    district?: NullableStringFieldUpdateOperationsInput | string | null
    subDistrict?: NullableStringFieldUpdateOperationsInput | string | null
    zipCode?: NullableStringFieldUpdateOperationsInput | string | null
    birthDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    occupation?: NullableStringFieldUpdateOperationsInput | string | null
    income?: NullableIntFieldUpdateOperationsInput | number | null
    education?: NullableStringFieldUpdateOperationsInput | string | null
    certificates?: NullableStringFieldUpdateOperationsInput | string | null
    idCardFront?: NullableStringFieldUpdateOperationsInput | string | null
    idCardBack?: NullableStringFieldUpdateOperationsInput | string | null
    idCardSelfie?: NullableStringFieldUpdateOperationsInput | string | null
    faceScan?: NullableStringFieldUpdateOperationsInput | string | null
    profileCompleted?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    jobsPosted?: JobUncheckedUpdateManyWithoutPostedByNestedInput
  }

  export type UserCreateWithoutJobsPostedInput = {
    phone?: string | null
    email?: string | null
    role?: string
    passwordHash?: string | null
    managerCode?: string | null
    workStatus?: string
    roleRank?: number
    googleId?: string | null
    facebookId?: string | null
    firstName?: string | null
    lastName?: string | null
    idCard?: string | null
    address?: string | null
    province?: string | null
    district?: string | null
    subDistrict?: string | null
    zipCode?: string | null
    birthDate?: Date | string | null
    occupation?: string | null
    income?: number | null
    education?: string | null
    certificates?: string | null
    idCardFront?: string | null
    idCardBack?: string | null
    idCardSelfie?: string | null
    faceScan?: string | null
    profileCompleted?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    activityLogs?: UserActivityLogCreateNestedManyWithoutActorInput
  }

  export type UserUncheckedCreateWithoutJobsPostedInput = {
    id?: number
    phone?: string | null
    email?: string | null
    role?: string
    passwordHash?: string | null
    managerCode?: string | null
    workStatus?: string
    roleRank?: number
    googleId?: string | null
    facebookId?: string | null
    firstName?: string | null
    lastName?: string | null
    idCard?: string | null
    address?: string | null
    province?: string | null
    district?: string | null
    subDistrict?: string | null
    zipCode?: string | null
    birthDate?: Date | string | null
    occupation?: string | null
    income?: number | null
    education?: string | null
    certificates?: string | null
    idCardFront?: string | null
    idCardBack?: string | null
    idCardSelfie?: string | null
    faceScan?: string | null
    profileCompleted?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    activityLogs?: UserActivityLogUncheckedCreateNestedManyWithoutActorInput
  }

  export type UserCreateOrConnectWithoutJobsPostedInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutJobsPostedInput, UserUncheckedCreateWithoutJobsPostedInput>
  }

  export type UserUpsertWithoutJobsPostedInput = {
    update: XOR<UserUpdateWithoutJobsPostedInput, UserUncheckedUpdateWithoutJobsPostedInput>
    create: XOR<UserCreateWithoutJobsPostedInput, UserUncheckedCreateWithoutJobsPostedInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutJobsPostedInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutJobsPostedInput, UserUncheckedUpdateWithoutJobsPostedInput>
  }

  export type UserUpdateWithoutJobsPostedInput = {
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    managerCode?: NullableStringFieldUpdateOperationsInput | string | null
    workStatus?: StringFieldUpdateOperationsInput | string
    roleRank?: IntFieldUpdateOperationsInput | number
    googleId?: NullableStringFieldUpdateOperationsInput | string | null
    facebookId?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    idCard?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    province?: NullableStringFieldUpdateOperationsInput | string | null
    district?: NullableStringFieldUpdateOperationsInput | string | null
    subDistrict?: NullableStringFieldUpdateOperationsInput | string | null
    zipCode?: NullableStringFieldUpdateOperationsInput | string | null
    birthDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    occupation?: NullableStringFieldUpdateOperationsInput | string | null
    income?: NullableIntFieldUpdateOperationsInput | number | null
    education?: NullableStringFieldUpdateOperationsInput | string | null
    certificates?: NullableStringFieldUpdateOperationsInput | string | null
    idCardFront?: NullableStringFieldUpdateOperationsInput | string | null
    idCardBack?: NullableStringFieldUpdateOperationsInput | string | null
    idCardSelfie?: NullableStringFieldUpdateOperationsInput | string | null
    faceScan?: NullableStringFieldUpdateOperationsInput | string | null
    profileCompleted?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    activityLogs?: UserActivityLogUpdateManyWithoutActorNestedInput
  }

  export type UserUncheckedUpdateWithoutJobsPostedInput = {
    id?: IntFieldUpdateOperationsInput | number
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    managerCode?: NullableStringFieldUpdateOperationsInput | string | null
    workStatus?: StringFieldUpdateOperationsInput | string
    roleRank?: IntFieldUpdateOperationsInput | number
    googleId?: NullableStringFieldUpdateOperationsInput | string | null
    facebookId?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    idCard?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    province?: NullableStringFieldUpdateOperationsInput | string | null
    district?: NullableStringFieldUpdateOperationsInput | string | null
    subDistrict?: NullableStringFieldUpdateOperationsInput | string | null
    zipCode?: NullableStringFieldUpdateOperationsInput | string | null
    birthDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    occupation?: NullableStringFieldUpdateOperationsInput | string | null
    income?: NullableIntFieldUpdateOperationsInput | number | null
    education?: NullableStringFieldUpdateOperationsInput | string | null
    certificates?: NullableStringFieldUpdateOperationsInput | string | null
    idCardFront?: NullableStringFieldUpdateOperationsInput | string | null
    idCardBack?: NullableStringFieldUpdateOperationsInput | string | null
    idCardSelfie?: NullableStringFieldUpdateOperationsInput | string | null
    faceScan?: NullableStringFieldUpdateOperationsInput | string | null
    profileCompleted?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    activityLogs?: UserActivityLogUncheckedUpdateManyWithoutActorNestedInput
  }

  export type JobCreateManyPostedByInput = {
    id?: number
    title: string
    type: string
    status?: string
    payAmount: number
    lat?: number | null
    lng?: number | null
    safeZoneReq?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserActivityLogCreateManyActorInput = {
    id?: number
    action: string
    targetUserId?: number | null
    targetEmail?: string | null
    targetRole?: string | null
    actorEmail?: string | null
    actorManagerCode?: string | null
    createdAt?: Date | string
  }

  export type JobUpdateWithoutPostedByInput = {
    title?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    payAmount?: IntFieldUpdateOperationsInput | number
    lat?: NullableFloatFieldUpdateOperationsInput | number | null
    lng?: NullableFloatFieldUpdateOperationsInput | number | null
    safeZoneReq?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type JobUncheckedUpdateWithoutPostedByInput = {
    id?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    payAmount?: IntFieldUpdateOperationsInput | number
    lat?: NullableFloatFieldUpdateOperationsInput | number | null
    lng?: NullableFloatFieldUpdateOperationsInput | number | null
    safeZoneReq?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type JobUncheckedUpdateManyWithoutPostedByInput = {
    id?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    payAmount?: IntFieldUpdateOperationsInput | number
    lat?: NullableFloatFieldUpdateOperationsInput | number | null
    lng?: NullableFloatFieldUpdateOperationsInput | number | null
    safeZoneReq?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserActivityLogUpdateWithoutActorInput = {
    action?: StringFieldUpdateOperationsInput | string
    targetUserId?: NullableIntFieldUpdateOperationsInput | number | null
    targetEmail?: NullableStringFieldUpdateOperationsInput | string | null
    targetRole?: NullableStringFieldUpdateOperationsInput | string | null
    actorEmail?: NullableStringFieldUpdateOperationsInput | string | null
    actorManagerCode?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserActivityLogUncheckedUpdateWithoutActorInput = {
    id?: IntFieldUpdateOperationsInput | number
    action?: StringFieldUpdateOperationsInput | string
    targetUserId?: NullableIntFieldUpdateOperationsInput | number | null
    targetEmail?: NullableStringFieldUpdateOperationsInput | string | null
    targetRole?: NullableStringFieldUpdateOperationsInput | string | null
    actorEmail?: NullableStringFieldUpdateOperationsInput | string | null
    actorManagerCode?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserActivityLogUncheckedUpdateManyWithoutActorInput = {
    id?: IntFieldUpdateOperationsInput | number
    action?: StringFieldUpdateOperationsInput | string
    targetUserId?: NullableIntFieldUpdateOperationsInput | number | null
    targetEmail?: NullableStringFieldUpdateOperationsInput | string | null
    targetRole?: NullableStringFieldUpdateOperationsInput | string | null
    actorEmail?: NullableStringFieldUpdateOperationsInput | string | null
    actorManagerCode?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}