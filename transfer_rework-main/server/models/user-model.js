const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    isActivated: { type: Boolean, default: false },
    activationLink: { type: String },
    role: { type: String, default: "user" }, // Додано поле ролі з значенням за замовчуванням "user"
});

module.exports = model("User", UserSchema);
