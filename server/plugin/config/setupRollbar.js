import Rollbar from "rollbar";

const rollbar = new Rollbar({
  accessToken: "<ServerAccessToken>",
  captureUncaught: true,
  captureUnhandledRejections: true,
});

// record a generic message and send it to Rollbar
rollbar.log("Hello world!");
