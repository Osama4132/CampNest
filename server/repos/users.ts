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

export async function fetchUserDataFromDB(userId: string) {
  const user = await User.findById(userId)
  console.log("User DB:", user)
  return user;
}

const userModel = { createUser, getUserId };

export default userModel;
