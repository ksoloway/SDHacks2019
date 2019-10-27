const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define a new Schema: specify the types of objects that will be stored in our db
const LoginSchema = new Schema({
	username: String,
	password: String,
	history: []
});

const Login = mongoose.model("login", LoginSchema);

module.exports = Login; // Export the schema so it can be accessed in App.js