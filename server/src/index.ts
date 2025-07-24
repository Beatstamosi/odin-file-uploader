import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import session from "express-session";
import passport from "passport";
import authRouter from "./routes/auth.js";
import "./config/passport.js";

// Give access to environment variables
dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Session Setup
const sessionSecret = process.env.SESSION_SECRET;

if (!sessionSecret) {
  throw new Error("SESSION_SECRET is not defined in environment variables.");
}

app.use(
  session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // true if using HTTPS
      httpOnly: true,
      sameSite: "lax", // adjust if needed
    },
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Give access to local user to all views --> NOT NEEDED FOR REACT
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

// Enable CORS only in dev
if (process.env.NODE_ENV === "development") {
  app.use(
    cors({
      origin: "http://localhost:5173",
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    })
  );
}

// Authentication Route
app.use("/user", authRouter);

// API route example
app.get("/", (req, res) => res.render("index", { user: req.user }));

// Serve static files in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/dist/index.html"));
  });
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
