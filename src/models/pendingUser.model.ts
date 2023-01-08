import {Schema, model} from 'mongoose'
import { IPendingUser } from '../interfaces'

const pendingUserSchema = new Schema<IPendingUser>({
    email: {
        type: String,
        required: true,
        unique: true
    },
    verified: {
        type: Boolean,
        default: false
    },
    verificationCode: {
        type: String,
        required: true
    },
    verificationExpiry: Date
})

const PendingUser = model<IPendingUser>("Pending User", pendingUserSchema);

export default PendingUser;