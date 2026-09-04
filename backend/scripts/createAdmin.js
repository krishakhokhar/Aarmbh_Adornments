// One-off CLI bootstrap script: the frontend has no "register admin" API,
// so the very first Admin account must be created this way.
// Usage: npm run create-admin -- <email> <password>
require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('../models/Admin');

async function run() {
    const [, , email, password] = process.argv;
    if (!email || !password) {
        console.error('Usage: node scripts/createAdmin.js <email> <password>');
        process.exit(1);
    }

    await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 8000 });

    const normalizedEmail = email.toLowerCase().trim();
    const existing = await Admin.findOne({ email: normalizedEmail });

    if (existing) {
        existing.password = password;
        await existing.save();
        console.log(`Updated password for existing admin: ${normalizedEmail}`);
    } else {
        await Admin.create({ email: normalizedEmail, password });
        console.log(`Created new admin account: ${normalizedEmail}`);
    }

    await mongoose.disconnect();
    process.exit(0);
}

run().catch((err) => {
    console.error('Failed to create admin:', err.message);
    process.exit(1);
});
