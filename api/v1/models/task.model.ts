import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({  
    title: String,
    status: String,
    content: String,
    createdBy: String,
    listUser: Array,
    taskParentId: String,
    timeStart: Date,
    timeFinish: Date,
    deleted: {
        type: Boolean,
        default: false
    },
    deletedAt: Date
}, {
    timestamps: true
});
  

const Task = mongoose.model('Task', taskSchema, 'tasks');
export default Task;