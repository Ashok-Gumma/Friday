import { Schema, model } from "mongoose";

const messageSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    type: { type: String, enum: ["user", "ai"], required: true },
  },
  { timestamps: true }
);

export default model("Message", messageSchema);
