import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  id: String,
  username: String,
  email: String,
});

const User = mongoose.model("User", userSchema);

export async function createUser(
  userId: string,
  username: string,
  email: string
) {
  const newUser = new User({ id: userId, username, email });
  await newUser.save();
}

export async function getUserId(email: unknown) {
  const user = User.findOne({ email: email });
  return user
}

const userModel = { createUser, getUserId };

export default userModel;
