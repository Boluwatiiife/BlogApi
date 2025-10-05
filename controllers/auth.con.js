const { signToken } = require("../middlewares/auth");
const userModel = require("../models/user.model");

exports.signup = async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;
    const user = await userModel.create({
      first_name,
      last_name,
      email,
      password,
    });
    const token = signToken(user._id);
    return res.status(201).json({
      token,
      user: { id: user._id, first_name, last_name, email },
    });
  } catch (err) {
    if (err.code === 11000)
      return res.status(400).json({
        message: "Email already in use!",
      });
    // console.log(err);
    return res.status(400).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Provide email and password!" });

    // find user
    const user = await userModel.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email" });

    // compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    const token = signToken(user._id);
    return res.json({
      token,
      user: {
        id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
