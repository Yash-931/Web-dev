const mongoose = require('mongoose');
require("dotenv").config();

mongoose.connect(process.env.MONGO_DB_URL);

const UserSchena = new mongoose.Schema({
    username: String, 
    password: String
});

const TodoSchema = new mongoose.Schema({
    title: String,
    description: String,
    userId: mongoose.Types.ObjectId
});

const userModel = mongoose.model("users", UserSchena);
const todoModel = mongoose.model("todos", TodoSchema);

module.exports = {
    userModel: userModel,
    todoModel: todoModel
}