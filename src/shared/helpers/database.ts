export function getMongoURI(
  username: string,
  password: string,
  host: string,
  port: string,
  databaseName: string,
): string {

  return `mongodb://${username}:${password}@${host}:${port}/${databaseName}?authSource=admin`;
  // return `mongodb://${username}:${password}@${host}:${port}/${databaseName}?retryWrites=true&w=majority`;
}
