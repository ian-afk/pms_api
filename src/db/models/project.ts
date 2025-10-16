import mongoose, { Schema } from 'mongoose';

const projectSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Project name is required'],
      unique: true,
    },
    description: String,
    startTime: Date,
    endTime: Date,
    status: {
      type: String,
      default: 'New',
    },
    user: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  { timestamps: true },
);

export const Project = mongoose.model('Project', projectSchema);
