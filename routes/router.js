import express from 'express';
import User from '../models/userSchema.js';
import { parse, isDate } from 'date-fns';
const Router = express.Router();

// Register user
Router.post('/register', async (req, res) => {
    const { name, dob, contact, email, desc } = req.body;

    if (!name || !dob || !contact || !email || !desc) {
        return res.status(422).json("Please fill all the data");
    }

    // Parse and validate date
    const parsedDob = parse(dob, 'yyyy-MM-dd', new Date());
    if (!isDate(parsedDob)) {
        return res.status(422).json("Invalid date format. Use 'YYYY-MM-DD'.");
    }

    try {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(422).json("This user already exists");
        } else {
            const newUser = new User({
                name, 
                dob: parsedDob, 
                contact, 
                email, 
                desc
            });

            await newUser.save();
            return res.status(201).json(newUser);
        }

    } catch (error) {
        return res.status(422).json(error);
    }
});

// Get all users
Router.get('/getdata', async (req, res) => {
    const { page = 1, limit = 10, search } = req.query;
    let query = {};

    try {
        // Apply search query if provided
        if (search) {
            query = { name: { $regex: search, $options: 'i' } }; // Case-insensitive search by name
        }

        const count = await User.countDocuments(query);
        const users = await User.find(query)
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const totalPages = Math.ceil(count / limit);

        return res.status(200).json({
            users,
            totalPages
        });
    } catch (error) {
        return res.status(422).json(error);
    }
});

// Get individual user by ID
Router.get('/getuser/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json("User not found");
        }
        return res.status(200).json(user);
    } catch (error) {
        return res.status(422).json(error);
    }
});

// Update user data
Router.patch('/updateuser/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedUser) {
            return res.status(404).json("User not found");
        }

        return res.status(200).json(updatedUser);
    } catch (error) {
        return res.status(422).json(error);
    }
});

// Delete user
Router.delete('/deleteuser/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ message: "User deleted successfully", user: deletedUser });
    } catch (error) {
        return res.status(422).json({ message: "Error deleting user", error: error.message });
    }
});
export default Router;
