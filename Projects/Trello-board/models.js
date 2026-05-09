const mongoose = require('mongoose');
require("dotenv").config();


mongoose.connect(process.env.MONGO_DB_URL);

const userSchema = mongoose.Schema({
    username: String,
    password: String
})

const organizationSchema = mongoose.Schema({
    title: String,
    description: String,
    admin: mongoose.Types.ObjectId,
    members: [mongoose.Types.ObjectId]
})

userModel = mongoose.model("users", userSchema);
organizationModel = mongoose.model("organizations", organizationSchema);

module.exports = {
    userModel,
    organizationModel
}