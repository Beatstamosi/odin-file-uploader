import passport from "passport";
import bcrypt from "bcryptjs";
import { User } from "../types/User.js";
import { Request, Response, NextFunction } from "express";
import userExists from "../services/userServices.js";
import prisma from "../lib/prisma.js";

// create empty root folder for each user on sign up
const signUpHandler = async (req: Request, res: Response) => {
  try {
    const exists = await userExists(req.body.email);

    if (!exists) {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      await prisma.user.create({
        data: {
          email: req.body.email,
          firstname: req.body.firstName,
          lastname: req.body.lastName,
          password: hashedPassword,
          folders: {
            create: [
              {
                name: "Home",
                parentFolderId: null,
              },
            ],
          },
        },
      });
      res.status(201).json({ message: "User signed up successfully." });
    } else {
      res.status(409).json({ error: "User already exists." });
    }
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ error: `Error signing up user: ${err.message}` });
    } else {
      res.status(500).json({ error: "Unknown error occurred during sign-up." });
    }
  }
};

const loginHandler = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate(
    "local",
    (
      err: Error | null,
      user: User | false,
      info: { message?: string } | undefined
    ) => {
      if (err) return next(err);
      if (!user) {
        return res.status(401).json({ error: info?.message || "Login failed" });
      }

      // Log the user in
      req.logIn(user, (err) => {
        if (err) return next(err);
        return res
          .status(200)
          .json({ message: "Logged in successfully", user });
      });
    }
  )(req, res, next);
};

function getUser(req: Request, res: Response) {
  if (req.isAuthenticated()) {
    // Send limited user data (avoid sending password, etc.)
    const { id, email, firstname, lastname, folders, files } = req.user;
    res.json({
      user: {
        id,
        email,
        firstName: firstname,
        lastName: lastname,
        folders,
        files,
      },
    });
  } else {
    res.status(401).json({ user: null });
  }
}

async function userAlreadySignedUp(req: Request, res: Response) {
  try {
    const exists = await userExists(req.body.email);

    res.status(200).json({ exists });
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ error: `Error signing up user: ${err.message}` });
    } else {
      res.status(500).json({
        error: "Unknown error occurred during check for existing user.",
      });
    }
  }
}

function logOut(req: Request, res: Response, next: NextFunction) {
  req.logout((err) => {
    if (err) return next(err);

    req.session.destroy((err) => {
      if (err) return next(err);
      res.clearCookie("connect.sid");
      res.status(200).json({ message: "User logged out successfully." });
    });
  });
}

export { signUpHandler, loginHandler, getUser, userAlreadySignedUp, logOut };
