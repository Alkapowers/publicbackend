import express from "express";
import jwt, { Secret } from "jsonwebtoken";
import { User } from "../models/User";
import { upload } from "../config/cloudinary";
import { authenticateToken, AuthRequest } from "../middleware/auth";

const router = express.Router();

// Register user
router.post("/register", upload.single("profilePicture"), async (req, res) => {
  try {
    const { firstName, lastName, email, password, phoneNumber, roles } =
      req.body;

    // Ensure JWT_SECRET is available
    const jwtSecret: string = process.env.JWT_SECRET as string;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET environment variable is required');
    }

    const jwtExpire = process.env.JWT_EXPIRE || "7d";

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: req.t("auth.user_exists"),
      });
    }

    // Create new user
    const userData: any = {
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
    };

    if (req.file) {
      userData.profilePicture = req.file.path;
    }

    if (roles) {
      userData.roles = Array.isArray(roles) ? roles : [roles];
    }

    const user = new User(userData);
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id },
      jwtSecret,
      {
        expiresIn: jwtExpire,
      }
    );

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(201).json({
      success: true,
      message: req.t("auth.registration_successful"),
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          profilePicture: user.profilePicture,
          roles: user.roles,
        },
        token,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: req.t("errors.server_error"),
      error: error.message,
    });
  }
});

// Login user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Ensure JWT_SECRET is available
    const jwtSecret: string = process.env.JWT_SECRET as string;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET environment variable is required');
    }

    const jwtExpire = process.env.JWT_EXPIRE || "7d";

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: req.t("auth.invalid_credentials"),
      });
    }

    // Check password
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: req.t("auth.invalid_credentials"),
      });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, jwtSecret, {
      expiresIn: jwtExpire,
    });

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({
      success: true,
      message: req.t("auth.login_successful"),
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          profilePicture: user.profilePicture,
          roles: user.roles,
        },
        token,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: req.t("errors.server_error"),
      error: error.message,
    });
  }
});

// Logout user
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({
    success: true,
    message: req.t("auth.logout_successful"),
  });
});

// Get current user
router.get("/me", authenticateToken, async (req: AuthRequest, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json({
      success: true,
      data: { user },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: req.t("errors.server_error"),
      error: error.message,
    });
  }
});

export default router;