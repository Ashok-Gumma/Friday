import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const { hash, compare } = bcrypt;

export async function signup(req, res) {
  try {
    console.log("Signup request body:", req.body);

    const {
      name,
      email,
      password,
      hobbies = [],
      strengths = [],
      weaknesses = [],
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPw = await hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPw,
      hobbies,
      strengths,
      weaknesses,
    });

    await user.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error("❌ Signup error:", err.message);
    res.status(500).json({ message: err.message });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      token,
      profile: {
        name: user.name,
        email: user.email,
        hobbies: user.hobbies,
        strengths: user.strengths,
        weaknesses: user.weaknesses,
      },
    });
  } catch (err) {
    console.error("❌ Login error:", err.message);
    res.status(500).json({ message: err.message });
  }
}

import { OAuth2Client } from "google-auth-library";
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function googleLogin(req, res) {
  try {
    const { token } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { name, email, picture, sub: googleId } = ticket.getPayload();

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        name,
        email,
        googleId,
        avatar: picture,
      });
      await user.save();
    } else if (!user.googleId) {
      user.googleId = googleId;
      user.avatar = picture;
      await user.save();
    }

    const jwtToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      token: jwtToken,
      profile: {
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        hobbies: user.hobbies,
        strengths: user.strengths,
        weaknesses: user.weaknesses,
      },
    });
  } catch (err) {
    console.error("❌ Google Login error:", err.message);
    res.status(500).json({ message: "Google Authentication failed" });
  }
}

export async function updateProfile(req, res) {
  try {
    const { strengths, weaknesses, hobbies } = req.body;
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (strengths) user.strengths = strengths;
    if (weaknesses) user.weaknesses = weaknesses;
    if (hobbies) user.hobbies = hobbies;

    await user.save();

    res.json({
      message: "Profile updated successfully",
      profile: {
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        hobbies: user.hobbies,
        strengths: user.strengths,
        weaknesses: user.weaknesses,
      },
    });
  } catch (err) {
    console.error("❌ Update profile error:", err.message);
    res.status(500).json({ message: err.message });
  }
}

export async function getProfile(req, res) {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({
      profile: {
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        hobbies: user.hobbies,
        strengths: user.strengths,
        weaknesses: user.weaknesses,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

