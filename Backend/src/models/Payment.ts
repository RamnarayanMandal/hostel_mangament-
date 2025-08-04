import mongoose from "mongoose";
import { PAYMENT_STATUS } from "../types/enum";

const paymentSchema = new mongoose.Schema({
    studentId :{
        type:mongoose.Schema.Types.ObjectId,
        require:true,
        ref:'Student',
    },
    amount:{
        type:Number,
        require:true,
    },
    paymentStatus:{
        enum:PAYMENT_STATUS,
        require:true,
        default:PAYMENT_STATUS.PENDING,
    },
    paymentDate:{
        type:Date,
        require:true,
    },
    paymentMethod:{
        type:String,
        require:true,
    },
    receiptUrl:{
        type:String,

    },
    transactionId:{
        type:String,
        require:true,
    },
    transactionDate:{
        type:Date,
        require:true,
    },


},{timestamps:true,
}
);

const Payment = mongoose.model('Payment',paymentSchema);

export default Payment;