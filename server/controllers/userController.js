import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Chat from "../models/Chat.js";

// Generate JWT Token
const genToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "30d",
  });
};

// REGISTER USER
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.json({
        success: false,
        message: "User already exists",
      });
    }

    // hash password here
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // generate token
    const token = genToken(user._id);

    return res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        credits: user.credits,
      },
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

// LOGIN USER

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // compare password
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // generate token
    const token = genToken(user._id);

    return res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        credits: user.credits,
      },
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};



// =======================
// GET USER (PROTECTED)
// =======================
export const getUser = async (req, res) => {
  try {
    const user = req.user;

    return res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        credits: user.credits,
      },
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

// api to get published images
export const getPublishedImages=async(req,res)=>{
  try {
    const publishedImageMessages= await Chat.aggregate([
      {
        $unwind:"$messages"
      },
      {
        $match:{
          "messages.isImage":true,
          "messages.isPublished":true
        }
      },
      {
        $project:{
          _id:0,
          imageUrl:"$messages.content",
          userName:"$userName"
        }
      }
    ])
    res.json({success:true,images:publishedImageMessages.reverse()})
  } catch (error) {
    res.json({success:false,message:error.message})
  }
}