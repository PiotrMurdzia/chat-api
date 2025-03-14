import { Document, Schema, Types, model } from "mongoose";

export interface IUser extends Document {
    email: string;
    fullName: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new Schema<IUser>(
    {
        email: { type: String, required: true, unique: true },
        fullName: { type: String, required: true },
        password: { type: String, required: true, minlength: 6 },
    },
    { timestamps: true }
);

export default model<IUser>("User", userSchema);
