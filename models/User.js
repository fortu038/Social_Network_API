const {Schema, model} = require("mongoose");

const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      // How do I get validators to work?
      // validate: {
      //   validator: () => {
      //     const regex = new RegExp(/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/);
      //     return regex.test(this.email);
      //   },
      //   message: "Invalid email",
      // },
    },
    thought: [Schema.Types.ObjectId],
    friends: [Schema.Types.ObjectId],
  },
  {
    toJSON: {
      virtuals: true,
    },
    id: false,
  },
);

userSchema
  .virtuals("friendCount")
  .get(function () {
    return this.friends.length;
  });

const User = model("user", userSchema);

module.exports = User;