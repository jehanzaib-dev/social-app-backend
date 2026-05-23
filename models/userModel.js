import mongoose, {Schema} from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema=new Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        min:3,
        max:10
    },
    email:{
        type:String,
        required:true,
        unique:true,
        max:50,
    },
    password:{
        type:String,
        required:true,
        min:8,
        max:20,
    },
    profilePic:{
    type:String,
    default:""
    },
    coverPic: {
        type:String,
        default:""
    },
    followers:{
        type:Array,
        default:[]
    },
    following:{
        type:Array,
        default:[]
    }
},
{
    timestamps:true,
}
);

userSchema.pre("save", async function(){
    if(!this.isModified("password")) return;
    this.password=await bcrypt.hash(this.password,10);
});

export const userModel=mongoose.model("user", userSchema);