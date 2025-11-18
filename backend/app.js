const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const createAuthRouter = require("./src/routes/authRoutes");
// const createInquiryRouter = require("./src/routes/inquiryRoutes");
// const createRoleRouter = require("./src/routes/roleRoutes");
// const createPolicyRouter = require("./src/routes/policyRoutes");
// const createEmployeeRouter = require("./src/routes/employeeRoutes");
// const createTestimonialRouter = require("./src/routes/testimonialRoutes");

const AuthController = require("./src/controllers/authController");
// const InquiryController = require("./src/controllers/inquiryController");
// const RoleController = require("./src/controllers/roleController");
// const PolicyController = require("./src/controllers/policyController");
// const EmployeeController = require("./src/controllers/employeeController");
// const TestimonialController = require("./src/controllers/testimonialController");

const UserService = require("./src/services/userService");
// const InquiryService = require("./src/services/inquiryService");
// const RoleService = require("./src/services/roleService");
// const PolicyService = require("./src/services/policyService");
// const EmployeeService = require("./src/services/employeeService");
// const TestimonialService = require("./src/services/testimonialService");


const db = require("./src/config/database");

// Controllers
// const { getUsersByLetter, addUser } = require("./controllers/controller");

const app = express();

// Middlewares
const allowedOrigins = [
  "http://localhost:5173"
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Test route
app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

//Dependency injection
const userService = new UserService(db);
// const inquiryService = new InquiryService(db);
// const roleService = new RoleService(db);
// const policyService = new PolicyService(db);
// const employeeService = new EmployeeService(db, userService, roleService);
// const testimonialService = new TestimonialService(db);

const authController = new AuthController(userService);
// const inquiryController = new InquiryController(inquiryService);
// const roleController = new RoleController(roleService);
// const policyController = new PolicyController(policyService);
// const employeeController = new EmployeeController(employeeService);
// const testimonialController = new TestimonialController(testimonialService);

const authRouter = createAuthRouter(authController);
// const inquiryRouter = createInquiryRouter(inquiryController);
// const roleRouter = createRoleRouter(roleController);
// const policyRouter = createPolicyRouter(policyController);
// const employeeRouter = createEmployeeRouter(employeeController);
// const testimonialRouter = createTestimonialRouter(testimonialController);



// API routes
app.use("/auth", authRouter);
// app.use("/inquiry", inquiryRouter);
// app.use("/role", roleRouter);
// app.use("/policy", policyRouter);
// app.use("/employee", employeeRouter);
// app.use("/testimonial", testimonialRouter);

module.exports = app;
