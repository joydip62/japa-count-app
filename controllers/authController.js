const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const nodemailer = require("nodemailer");

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword, // ✅ Only use hashedPassword here
      role: "user",
    });

    await newUser.save(); // ✅ Save after setting the hashed password

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Registration Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.json({
      token,
      email: user.email,
      role: user.role,
      message: "Login successful",
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Forgot Password Route
exports.forgetPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    // const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;
    // const resetLink = `https://japa-counter-app-client.onrender.com/reset-redirect?token=${token}`;
    // const resetLink = `${process.env.FRONTEND_URL}/reset-redirect?token=${token}`;
    const resetLink = `${process.env.FRONTEND_URL}/#/reset-password?token=${token}`;






    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const emailHTML = `
  <div style="font-family: Arial, sans-serif; padding: 20px; background: #f4f4f4;">
    <div style="max-width: 600px; margin: auto; background: white; padding: 30px; border-radius: 8px;">
      <h2 style="color: #333;">Japa Counter - Reset Password</h2>
      <p>Hello <strong>${user.email}</strong>,</p>
      <p>You requested a password reset. Click the button below to reset it:</p>
      
      <a href="${resetLink}" 
         style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">
         Reset Password
      </a>

      <p style="margin-top: 20px;">If the button doesn’t work, copy this link into your browser:</p>
      <p style="word-break: break-all;">${resetLink}</p>

      <p style="margin-top: 30px;">Stay peaceful 🧘,<br>Japa Counter Team(JPS Archives)</p>
    </div>
  </div>
`;
    
    await transporter.sendMail({
      from: `"Japa App" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Reset Your Password",
      html: emailHTML,
    });

    res.json({ message: "Reset link sent to your email." });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Reset Password Route
exports.resetPassword = async (req, res) => {
  const { token, password } = req.body;

  if (!token || !password)
    return res.status(400).json({ error: "Missing token or password" });

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user)
      return res.status(404).json({ error: "User not found or token expired" });

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    user.password = hashed;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error("Reset password error:", err.message);
    res.status(400).json({ error: "Invalid or expired token" });
  }
};



