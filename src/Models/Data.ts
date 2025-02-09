import mongoose from "mongoose";

export interface DataAttrs {
  input: string;
  output: string;
  image: string;
  priority: "good" | "better" | "best";
}

const dataSchema = new mongoose.Schema({
  input: { type: String, required: true },
  output: { type: String, required: true },
  image: { type: String, required: true },
  priority: { type: String, enum: ["good", "better", "best"], required: true },
});

const Data = mongoose.models.Data || mongoose.model("Data", dataSchema);

export default Data;
