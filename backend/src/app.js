const express = require("express");
const cors = require("cors");

const logger = require("./utils/logger");

const venueRoutes =
require("./routes/venueRoutes");

const hallRoutes =
require("./routes/hallRoutes");

const bookingRoutes =
require("./routes/bookingRoutes");

const availabilityRoutes =
require("./routes/availabilityRoutes");

const functionRoutes =
require("./routes/functionRoutes");

const beoRoutes =
require("./routes/beoRoutes");

const authRoutes =
require("./routes/authRoutes");

const billingRoutes =
require("./routes/billingRoutes");

const menuRoutes =
require("./routes/menuRoutes");

const layoutRoutes =
require("./routes/layoutRoutes");

const approvalRoutes =
require("./routes/approvalRoutes");

const reportRoutes =
require("./routes/reportRoutes");

const errorMiddleware =
require("./middlewares/errorMiddleware");


const app = express();
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const swaggerUi =
require(
 "swagger-ui-express"
);

const YAML =
require("yamljs");

const swaggerDoc =
YAML.load(
 "./src/docs/swagger.yaml"
);

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later."
  }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many authentication attempts, please try again later."
  }
});

app.disable("x-powered-by");
app.use(helmet());
app.use(compression());
app.use(morgan("dev"));
const allowedOrigins = [
  ...(process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(",").map((origin) => origin.trim()).filter(Boolean) : ["http://localhost:3000"]),
  "http://localhost:5173"
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(apiLimiter);

app.use((req, res, next) => {
  logger.warn("Request received", {
    method: req.method,
    path: req.originalUrl,
    ip: req.ip
  });
  next();
});

app.use(
  "/api/venues",
  venueRoutes
);

app.use(
  "/api/halls",
  hallRoutes
);

app.use(
  "/api/bookings",
  bookingRoutes
);

app.use(
  "/api/availability",
  availabilityRoutes
);

app.use(
  "/api/functions",
  functionRoutes
);

app.use(
 "/api/beos",
 beoRoutes
);

app.use(
 "/api/auth",
 authLimiter,
 authRoutes
);

app.use(
 "/api/billing",
 billingRoutes
);

app.use(
 "/api/menu",
 menuRoutes
);

app.use(
 "/api/layouts",
 layoutRoutes
);

app.use(
 "/api/approvals",
 approvalRoutes
);

app.use(
 "/api/reports",
 reportRoutes
 );

app.use(
 "/api-docs",
 swaggerUi.serve,
 swaggerUi.setup(
  swaggerDoc
 )
);

const healthRoutes =
require("./routes/healthRoutes");

app.use(
 "/health",
 healthRoutes
);

app.get("/", (req, res) => {
  res.send("BNQ Backend Running Successfully 🚀");
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Resource not found"
  });
});

app.use(errorMiddleware);

module.exports = app;