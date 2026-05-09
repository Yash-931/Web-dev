const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://yaggarwal931:CAflFFPka0x20h2P@cluster0.xurejjz.mongodb.net/todo")

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