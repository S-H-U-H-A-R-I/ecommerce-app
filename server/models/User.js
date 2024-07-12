import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true, minlength: 1, maxlength: 255, trim: true },
    surname: { type: String, required: true, minlength: 1, maxlength: 255, trim: true },
    email: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 255,
        unique: true,
        trim: true,
        lowercase: true,
        index: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    phone: {
        type: String,
        validate: {
            validator: function(v) {
                return /^\+?[1-9]\d{1,14}$/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
        }
    },
    address: { street: String, apartment: String, city: String },
    image: { type: String, default: "https://cdn.pixabay.com/photo/2018/11/13/21/43/avatar-3814049_960_720.png" },
    cart: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        quantity: { type: Number, default: 1, min: 1 }
    }],
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }], // Create Order model
    role: { type: String, enum: ['customer', 'staff', 'admin'], default: 'customer' },
    accountStatus: { type: String, enum: ['active', 'suspended', 'deleted'], default: 'active' },
    loginAttempts: { type: Number, default: 0, min: 0 },
    lastLogin: { type: Date },
}, { timestamps: true });

UserSchema.pre('save', function(next) {
    if (this.isModified('lastLogin')) this.loginAttempts = 0;
    if (this.isModified('loginAttempts') && this.loginAttempts >= 5) {
        // TODO: Send email to user that there has been multiple failed attempts to login to 
        // their account. This can be safely ignored, but if you have a problem loggin in
        // Then please contact us. 
    };
    next();
});

export default mongoose.model('User', UserSchema);