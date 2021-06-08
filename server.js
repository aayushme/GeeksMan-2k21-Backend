const app = require("./app");
const mongoose = require("mongoose");
const port = process.env.PORT || 5000;
require('dotenv').config()
mongoose
  .connect(`${process.env.DATABASE_URL}`, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => {
    app.listen(port, () => {
      console.log("server is running on port", port);
    });
  })
  .catch((err) => {
    console.log(err);
  });
