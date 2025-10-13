import mongoose, { Schema } from 'mongoose';

const commentSchema = new Schema(
  {
    comment: {
      type: String,
      required: [true, 'comment cannot be null'],
    },
    task: {
      type: Schema.Types.ObjectId,
      ref: 'Task',
      required: [true, 'Comment task is required'],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Comment User is required'],
    },
    suppFiles: {
      type: [String],
    },
  },
  { timestamps: true },
);

export const Commnet = mongoose.model('Comment', commentSchema);
