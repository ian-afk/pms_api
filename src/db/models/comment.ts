import mongoose, { Schema } from 'mongoose';

const commentSchema = new Schema(
  {
    comment: {
      type: String,
      required: [true, 'Comment cannot be null'],
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

export const Comment = mongoose.model('Comment', commentSchema);
