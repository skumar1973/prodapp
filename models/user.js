const {createHmac, randomBytes} = require("crypto");

const {Schema, model} = require("mongoose");
const {createToken, validateToken} = require("../services/authentication")

const userSchema = new Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    salt: {
        type: String
    },
    password: {
        type: String,
        required: true
    },
    profileImageURL:{
        type: String,
        default: "/images/default.png"
    },
    role: {
        type: String,
        enum: ["USER", "ADMIN"],
        default: "USER"
    }

}, {timestamps: true}
);

userSchema.pre("save", async function (next) {
    const user = this;

    if (!user.isModified("password")) return;

    const salt = randomBytes(16).toString();
    //const salt = "salt1234";
    const hashedPassword = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");

    this.salt = salt;
    this.password = hashedPassword;
    next();
});

userSchema.static("matchPasswordGenerateToken", async function(email, password) {

    const user = await this.findOne({ email});
    
    if (!user) throw new Error("User not found");

    const salt = user.salt;
    const hashPassword = user.password;
   
    const userProvidedHash =  createHmac("sha256", salt)
    .update(password)
    .digest("hex");
   
    console.log(user);

    if (hashPassword !== userProvidedHash)
        throw new Error("incorrect password");

    return createToken(user);

});

const User = model('user', userSchema);

module.exports = User;

