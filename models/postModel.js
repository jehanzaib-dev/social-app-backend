import mongoose, {Schema} from 'mongoose';

const postSchema=new Schema({
	userId:{
		type:String,
		required:true
	},
	desc:{
		type:String,
		max:500
	},
	img:{
		type:String,
		default:"",
	},
	likes:{
		type:Array,
		default:[],
	},
	comments: [
  {
    userId: {
      type: String,
    },

    username: {
      type: String,
    },

    text: {
      type: String,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
],
},
{
	timestamps:true,
}
);

export const postModel=mongoose.model("post", postSchema);
