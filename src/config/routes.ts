import authRouter from "@src/routes/authRoutes";
import adminRouter from "@src/routes/adminRoutes";
import mediaRoute from "@src/routes/mediaRoutes";

const Routes = (app: any) => {
  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/admin", adminRouter);
  app.use("/api/v1/media", mediaRoute);
};

export default Routes;

