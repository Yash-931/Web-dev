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

const boardSchema = mongoose.Schema({
    title: String,
    organization: mongoose.Types.ObjectId,
    issues: [mongoose.Types.ObjectId]
})

const issueSchema = mongoose.Schema({
    title: String,
    description: String,
    board: mongoose.Types.ObjectId
})

userModel = mongoose.model("users", userSchema);
organizationModel = mongoose.model("organizations", organizationSchema);
boardModel = mongoose.model("board", boardSchema);
issuesModel = mongoose.model("issues", issueSchema);

module.exports = {
    userModel,
    organizationModel,
    boardModel,
    issuesModel
}