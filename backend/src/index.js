import dotenv from "dotenv";
import connectDB from "./db/db.js";
import { app } from "./app.js";

dotenv.config({ path: "./.env" });

connectDB()
  .then(() => {
    app.on("error", (err) => {
      console.log("ERROR -on", err);
      throw err;
    });

    app.listen(process.env.PORT || 8001, () =>
      console.log(`server is started on http://localhost:${process.env.PORT}`)
    );
  })
  .catch((err) => console.log(("mongo DB connection failed !!!", err.message)));
