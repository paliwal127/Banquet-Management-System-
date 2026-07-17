const {
 cleanEnv,
 str,
 port
}
=
require("envalid");

module.exports =
cleanEnv(
 process.env,
 {
  PORT: port(),
  DB_HOST: str(),
  DB_PORT: port(),
  DB_USER: str(),
  DB_NAME: str(),
  DB_PASSWORD: str(),
  JWT_SECRET: str(),
  CORS_ORIGIN: str({ default: "http://localhost:3000" }),
  NODE_ENV: str({ default: "development" })
 }
);