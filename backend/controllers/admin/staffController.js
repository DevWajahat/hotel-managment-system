const User = require('../../models/user');
const bcrypt = require('bcrypt');

// @desc    Create a new staff/admin member
// @route   POST /api/admin/staff
const createStaff = async (req, res) => {
	try {
		const { full_name, email, password, role } = req.body;

		// 1. Basic Validation
		if (!full_name || !email || !password || !role) {
			return res.status(400).json({ message: "All fields are required" });
		}

		// 2. Check if user exists
		const userExists = await User.findOne({ email });
		if (userExists) {
			return res.status(400).json({ message: "User with this email already exists" });
		}

		// 3. Hash Password
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		// 4. Create User (Force verification since Admin is creating it)
		const newStaff = await User.create({
			full_name,
			email,
			password: hashedPassword,
			role: role, // 'admin' or 'staff'
			is_verified: true
		});

		// Return user without password
		res.status(201).json({
			_id: newStaff._id,
			full_name: newStaff.full_name,
			email: newStaff.email,
			role: newStaff.role
		});

	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// @desc    Get all staff members (exclude basic users if needed)
// @route   GET /api/admin/staff
const getAllStaff = async (req, res) => {
	try {
		// Fetch only admins and staff, exclude normal 'user' role
		// If you want ALL users, remove the filter: find({})
		const staffMembers = await User.find({
			role: { $in: ['admin', 'staff'] }
		}).select('-password'); // Exclude password from result

		res.json(staffMembers);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// @desc    Update staff details
// @route   PUT /api/admin/staff/:id
const updateStaff = async (req, res) => {
	try {
		const { full_name, email, role, password } = req.body;

		// Find user first to handle password separately
		const user = await User.findById(req.params.id);
		if (!user) return res.status(404).json({ message: "Staff not found" });

		// Update fields
		user.full_name = full_name || user.full_name;
		user.email = email || user.email;
		user.role = role || user.role;

		// Only hash and update password if a new one is provided
		if (password && password.trim() !== "") {
			const salt = await bcrypt.genSalt(10);
			user.password = await bcrypt.hash(password, salt);
		}

		const updatedUser = await user.save();

		res.json({
			_id: updatedUser._id,
			full_name: updatedUser.full_name,
			email: updatedUser.email,
			role: updatedUser.role
		});

	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// @desc    Delete staff member
// @route   DELETE /api/admin/staff/:id
const deleteStaff = async (req, res) => {
	try {
		// Prevent deleting yourself (optional safety check)
		if (req.user._id.toString() === req.params.id) {
			return res.status(400).json({ message: "You cannot delete your own account" });
		}

		await User.findByIdAndDelete(req.params.id);
		res.json({ message: "Staff member removed" });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

module.exports = {
	createStaff,
	getAllStaff,
	updateStaff,
	deleteStaff
};
