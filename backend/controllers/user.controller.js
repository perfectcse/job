import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import { v2 as cloudinaryV2 } from "cloudinary";

// Register

export const register = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, password, role } = req.body;

    if (!fullname || !email || !phoneNumber || !password || !role) {
      return res.status(400).json({
        message: "Something is missing",
        success: false,
      });
    }

    const file = req.file;

    if (!file) {
      return res.status(400).json({
        message: "Profile photo is required",
        success: false,
      });
    }

    const fileUri = getDataUri(file);
    const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        message: "User already exists with this email.",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      fullname: fullname,
      email,
      phoneNumber,
      password: hashedPassword,
      role,
      profile: {
        profilePhoto: cloudResponse.secure_url,
      },
    });

    return res.status(201).json({
      message: "Account created successfully.",
      success: true,
      newUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

//   Login --------------------------------------------------------------

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({
        message: "Something is missing",
        success: false,
      });
    }
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Incorrect email or password.",
        success: false,
      });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "Incorrect email or password.",
        success: false,
      });
    }
    // check role is correct or not
    if (role !== user.role) {
      return res.status(400).json({
        message: "Account doesn't exist with current role.",
        success: false,
      });
    }

    const tokenData = {
      userId: user._id,
    };
    const token = await jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    user = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpsOnly: true,
        sameSite: "strict",
      })
      .json({
        message: `Welcome back ${user.fullname}`,
        user,
        success: true,
      });
  } catch (error) {
    console.log(error);
  }
};

// Log Out
export const logout = async (req, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "Logged out successfully.",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

// Update

export const updateProfile = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, bio, skills } = req.body;
    const resume = req.file; // Expecting file with field name 'resume'

    // Validate required fields
    if (!req.id) {
      return res.status(401).json({ message: "Unauthorized", success: false });
    }

    // Fetch user by ID
    const userId = req.id;
    let user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found.", success: false });
    }

    // Update user fields
    if (fullname) user.fullname = fullname;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (bio) user.profile.bio = bio;
    if (skills) user.profile.skills = skills.split(",");

    // Handle file upload
    if (resume) {
      if (resume.mimetype !== "application/pdf") {
        return res
          .status(400)
          .json({ message: "Only PDF files are allowed.", success: false });
      }

      // Use upload_stream for Buffer data
      const uploadStream = cloudinaryV2.uploader.upload_stream(
        { resource_type: "raw", allowed_formats: ["pdf"] },
        (error, cloudResponse) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            return res
              .status(500)
              .json({ message: "Error uploading file.", success: false });
          }

          // Update resume fields with Cloudinary response
          user.profile.resume = cloudResponse.secure_url;
          user.profile.resumeOriginalName = resume.originalname;

          // Save updated user
          user
            .save()
            .then(() => {
              return res.status(200).json({
                message: "Profile updated successfully.",
                user: {
                  _id: user._id,
                  fullname: user.fullname,
                  email: user.email,
                  phoneNumber: user.phoneNumber,
                  role: user.role,
                  profile: user.profile,
                },
                success: true,
              });
            })
            .catch((saveError) => {
              console.error("Error saving user:", saveError);
              return res
                .status(500)
                .json({ message: "Error saving user.", success: false });
            });
        }
      );

      // End the stream with the file buffer
      uploadStream.end(resume.buffer);
    } else {
      // Save user if no file is provided
      await user.save();
      return res.status(200).json({
        message: "Profile updated successfully.",
        user: {
          _id: user._id,
          fullname: user.fullname,
          email: user.email,
          phoneNumber: user.phoneNumber,
          role: user.role,
          profile: user.profile,
        },
        success: true,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};
