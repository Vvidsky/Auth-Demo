const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, "Username cannot be empty"]
    },
    password: {
        type: String,
        required: [true, "password cannot be empty"]
    }
})

userSchema.statics.findAndValidate = async function (username, password) {
    const user = await this.findOne({username});
    const is_valid = await bcrypt.compare(password, user.password);
    return is_valid? user: false;
}

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
})

module.exports = mongoose.model('User', userSchema);