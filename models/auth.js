import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  name: { type: String, required: true ,unique: true},
  otp: {type:String},
  email: { type: String, required: true },
  password: { type: String, required: true },
  about: { type: String },
  tags: { type: [String] },
  subscription: { type: String, enum: ['free', 'silver', 'gold'], default: 'free' },
  questionQuota: { type: Number, default: 1 },
  questionsPosted: { type: Number, default: 0 },
  subscriptionExpiresAt: {
    type: Date,
    default: function () {
      const oneDayInMilliseconds = 24 * 60 * 60 * 1000; 
      const tomorrow = new Date(Date.now() + oneDayInMilliseconds);
      return tomorrow;
    },
  },
  joinedOn: { type: Date, default: Date.now },
  failedAttempts: { type: Number, default: 0 },
  blockedUntil: { type: Date, default: null }, 
});

export default mongoose.model("User", userSchema);
