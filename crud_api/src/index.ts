import express from "express";
import userRouter from "./routes/user";

const app = express();
const port = 3000;

app.use(express.json());
app.use("/api/users", userRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;
