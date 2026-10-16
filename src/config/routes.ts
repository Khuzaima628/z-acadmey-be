import authRouter from "@src/routes/authRoutes";
import adminRouter from "@src/routes/adminRoutes";
import mediaRoute from "@src/routes/mediaRoutes";
import courseRouter from "@src/routes/courseRoutes";
import paymentRouter from "@src/routes/paymentRoutes";
import studentRouter from "@src/routes/studentRoutes";
import instructorRouter from "@src/routes/instructorRoutes";

const Routes = (app: any) => {
  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/admin", adminRouter);
  app.use("/api/v1/media", mediaRoute);
  app.use("/api/v1/course", courseRouter);
  app.use("/api/v1/payment", paymentRouter);
  app.use("/api/v1/student", studentRouter);
  app.use("/api/v1/instructor", instructorRouter);
};

export default Routes;

