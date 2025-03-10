import { Document, Schema, Types, model } from "mongoose";

export interface IMessage extends Document {
    senderId: Types.ObjectId;
    receiverId: Types.ObjectId;
    text?: string;
    image?: string;
    createdAt: Date;
    updatedAt: Date;
}

const messageSchema = new Schema<IMessage>(
    {
        senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        receiverId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        text: { type: String },
        image: { type: String }
    },
    { timestamps: true }
);

export default model<IMessage>("Message", messageSchema);
