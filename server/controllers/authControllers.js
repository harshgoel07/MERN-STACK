// server/controllers/authControllers.js

const User = require('../models/User');
const { hashPassword, comparePassword } = require('../helpers/auth');
const jwt = require('jsonwebtoken');

const test = (req, res) => {
    res.json("testing server");
};

const registerUser = async (req, res) => {
    try {
        const { user_name, email, password, role } = req.body;
        if (!user_name) {
            return res.json({ error: "Name is required" });
        }
        if (!password || password.length < 6) {
            return res.json({ error: "Password is required and should be 6 characters long" });
        }
        const exist = await User.findOne({ email });
        if (exist) {
            return res.json({ error: "Email is already taken" });
        }
        const hashedPassword = await hashPassword(password);
        const user = await User.create({ user_name, email, password: hashedPassword, role });
        return res.json(user);
    } catch (error) {
        console.log(error);
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ error: "No user found" });
        }
        const match = await comparePassword(password, user.password);
        // if (match) {
        //     jwt.sign({ email: user.email, id: user._id, name: user.name }, process.env.JWT_SECRET, {}, (err, token) => {
        //         if (err) throw err;
        //         res.cookie('token', token).json(user);
        //     });
        // }
        if (match) {
            jwt.sign(
                { email: user.email, id: user.user_id, name: user.user_name, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: '1h' },
                (err, token) => {
                  if (err) throw err;

                  console.log(token)
                  res.json({ token,
                    email: user.email,
                    user_id: user.user_id,
                    name: user.user_name,
                    role: user.role
                 });
                }
              );
        }else {
            res.json({ error: "Wrong Password" });
        }
    } catch (error) {
        console.log(error);
    }
};

const fetchAllUsers = async (req, res) => {
    try {
        // Find users whose role is "user"
        const users = await User.find({ role: "user" });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const getProfile = async (req, res) => {
    const { token } = req.cookies;
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, {}, async (err, decodedToken) => {
            if (err) {
                return res.status(401).json({ msg: 'Token is not valid' });
            }
            try {
                const user = await User.findById(decodedToken.id).select('-password');
                if (!user) {
                    return res.status(404).json({ msg: 'User not found' });
                }
                res.json(user);
                console.log(user);
            } catch (error) {
                console.error(error.message);
                res.status(500).send('Server error');
            }
        });
    } else {
        res.json(null);
    }
};

const getUsers = async (req, res) => {
    try {
        const users = await User.find({role: "user"}).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { test, registerUser, loginUser, getProfile, fetchAllUsers, getUsers };
