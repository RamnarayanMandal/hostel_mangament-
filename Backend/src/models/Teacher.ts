import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema({
    UserId:{
        type:mongoose.Schema.Types.ObjectId,
        require:true,
        ref:'User',
    },
    department:{
        type:String,
    },
    designation:{
        type:String,
    }
},{
    timestamps:true,
}
);

const Teacher = mongoose.model('Teacher',teacherSchema);

export default Teacher;