import { OptionType } from 'types/commonType';
import { Comment } from '../db/models/comment';
import { AppError } from '../utils/AppError';

interface CreateCommentI {
  comment: string;
  task: string;
  user: string;
  suppFiles?: string[];
}
export async function createComment({
  comment,
  task,
  user,
  suppFiles,
}: CreateCommentI) {
  const newComment = await Comment.create({
    comment,
    task,
    user,
    suppFiles,
  });
  return newComment;
}

export async function getComment(
  query = {},
  { sortBy = 'createdAt', sortOrder = 'desc' } = {},
) {
  const order = sortOrder === 'desc' ? -1 : 1;

  const sortField = sortBy || 'createdAt';

  const filter: Record<string, any> = {};

  for (const key in query) {
    if (key !== 'sortBy' && key !== 'sortOrder') {
      filter[key] = { $regex: query[key], $options: 'i' };
    }
  }

  const comment = await Comment.find(filter).sort({ [sortField]: order });
  return comment;
}

export async function listAllComment(query, options?: OptionType) {
  const comment = await getComment(query, options);

  return comment;
}

export async function findCommentById(commentId: string) {
  const comment = await Comment.findById(commentId);

  if (!comment)
    throw new AppError(`Comment Id ${commentId} doesn't exists`, 404);
  return comment;
}

interface UpdateCommentI {
  comment: string;
  task: string;
  user: string;
  suppFiles?: string[];
}

export async function updateComment(
  commentId: string,
  { comment, task, user, suppFiles }: UpdateCommentI,
) {
  const columnUpdate = Object.fromEntries(
    Object.entries({
      comment,
      task,
      user,
      suppFiles,
    }).filter(([, v]) => v !== undefined),
  );

  return await Comment.findOneAndUpdate(
    {
      _id: commentId,
    },
    {
      $set: columnUpdate,
    },
    { new: true },
  );
}

export async function deleteComment(commentId: string) {
  return await Comment.deleteOne({ _id: commentId });
}
