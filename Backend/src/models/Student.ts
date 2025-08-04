import mongoose from "mongoose";
import { object } from "zod";
import { APPLICATION_STATUS, CATEGORY, PAYMENT_STATUS } from "../types/enum";

const studentSchema = new mongoose.Schema({
    UserId:{
        type:mongoose.Schema.Types.ObjectId,
        require:true,
        ref:'User',

    },
    course:{
        type:String,
        require:true,
    },
    section:{
        type:String,
        require:true,
    },
    rollNumber:{
        type:String,
        require:true,
    },
    year:{
        type:Number,
        require:true,
    },
    semester:{
        type:Number,
        require:true,
    },
    branch:{
        type:String,
        require:true,
    },
    registrationNumber:{
        type:String,
       
    },
    isSenior:{
        type:Boolean,
        default:false,
    },
    applicationStatus :{
        type:String,
        enum:APPLICATION_STATUS,
        default:APPLICATION_STATUS.PENDING,

    },
    seatReservationRequest :{
        type:Boolean,
        default:false,
    },
    category:{
        enum:CATEGORY,
        default:CATEGORY.GENERAL,
    },
    hotelFeePaid:{
        type:Boolean,
        default:false,
    },
    hotelFee:{
        type:Number,
        default:0,
    },
    casteCertificate:{
        type:String,
    },
    casteCertificateDate:{
        type:Date,
    },
   
},
{
    timestamps:true,
}
);

const Student = mongoose.model('Student',studentSchema);

export default Student;