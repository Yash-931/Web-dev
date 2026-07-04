const mongoose = require('mongoose');
const { ref } = require('node:process');
require('dotenv').config()

mongoose.connect(process.env.MONGO_DB_URL)
    .then(() => console.log("DB connection successful"))
    .catch(err => console.log("DB connection failed with error: " + err))

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },

    lastName: {
        type: String,
        required: true
    },

    username: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

}, {
    timestamps: true
});

const accountSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    balance: {
        type: Number,
        required: true
    }
})

const User = mongoose.model("User", userSchema);
const Account = mongoose.model("Account", accountSchema);
module.exports = {
    User,
    Account
}
