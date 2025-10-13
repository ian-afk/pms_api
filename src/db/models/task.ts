import mongoose, { Schema } from 'mongoose';

const taskSchema = new Schema(
  {
    task: {
      type: String,
      required: [true, 'Task field is required'],
      unique: true,
    },
    description: String,
    project: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    estStartTime: Date,
    estEndTime: Date,
    priority: Boolean,
    status: {
      type: String,
      default: 'New',
    },
    suppFiles: String,
  },
  {
    timestamps: true,
  },
);

export const Task = mongoose.model('Task', taskSchema);
