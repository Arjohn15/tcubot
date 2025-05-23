import app from "./app";
import { connectToDB } from "./config/db";

const PORT = Number(process.env.PORT) || 5000;

connectToDB().then(() => {
  app.listen(PORT, "0.0.0.0", () =>
    console.log(`Server running on port ${PORT}`)
  );
});
