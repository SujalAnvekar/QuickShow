import openai from "../configs/openAI.js";
import Chat from "../models/Chat.js";
import User from "../models/User.js";

// text based AI Chat msg controller
export const textMessage = async (req, res) => {
  try {
    const userId = req.user._id;
    const { chatId, prompt } = req.body;

    // Validate input
    if (!chatId || !prompt?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Chat ID and prompt are required",
      });
    }

    const chat = await Chat.findOne({ userId, _id: chatId });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    chat.messages.push({
      role: "user",
      content: prompt,
      timestamp: Date.now(),
      isImage: false,
    });

    const { choices } = await openai.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const reply = {
      ...choices[0].message,
      timestamp: Date.now(),
      isImage: false,
    };

    chat.messages.push(reply);

    await chat.save();

    await User.updateOne(
      { _id: userId },
      { $inc: { credits: -1 } }
    );

    return res.json({ success: true, reply });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

// img generation api message
export const imageMessage = async (req, res) => {
  try {
    const userId = req.user._id;

    if (req.user.credits < 2) {
      return res.json({
        success: false,
        message: "You dont have enough credits to use this feature",
      });
    }

    const { prompt, chatId, isPublished } = req.body;

    const chat = await Chat.findOne({ userId, _id: chatId });

    if (!chat) {
      return res.json({
        success: false,
        message: "Chat not found",
      });
    }

    chat.messages.push({
      role: "user",
      content: prompt,
      timestamp: Date.now(),
      isImage: false,
    });

  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};