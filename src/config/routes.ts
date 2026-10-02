import authRouter from "@src/routes/authRoutes";

const Routes = (app: any) => {
  app.use("/api/v1/auth", authRouter);
};

export default Routes;
