const debug = require("debug")("node-angular");
const HTTP = require("http");
const APP = require("./app");

const normalizePort = (value) => {
  let port = parseInt(value, 10);

  if (isNaN(port)) {
    // named pipe
    return value;
  }

  if (port >= 0) {
    // port number
    return port;
  }
  return false;
};

const onError = (error) => {
  if (error.syscall !== "listen") {
    throw error;
  }

  const bind = typeof addr === "string" ? "pipe" + addr : "port" + port;
  switch (error.code) {
    case "EACCES":
      console.log(bind + "requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.log(bind + "is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const onListening = () => {
  const addr = server.address();
  const bind = typeof addr === "string" ? "pipe" + addr : "port " + port;
  debug("Listening on " + bind);
};

const port = normalizePort(process.env.PORT || 3000);
APP.set("port", port);

const server = HTTP.createServer(APP);
server.on("error", onError);
server.on("listening", onListening);

server.listen(port);
