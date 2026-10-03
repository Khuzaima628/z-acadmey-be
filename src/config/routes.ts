import authRouter from "@src/routes/authRoutes";
import adminRouter from "@src/routes/adminRoutes";

const Routes = (app: any) => {
  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/admin", adminRouter);
};

export default Routes;

