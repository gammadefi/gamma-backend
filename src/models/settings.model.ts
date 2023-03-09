import {model, Schema} from "mongoose";
import {ISettings} from '../interfaces';

const settingsSchema = new Schema<ISettings>({
    verificationCodeExpiry: {
        type: Number,
        required: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "Admin",
        required: true
    }
}, {timestamps: true});

export default model<ISettings>("Setting", settingsSchema);
