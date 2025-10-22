import { AppError } from './AppError';

export const Rights = {
  ROLES: {
    ADD: 'add_role',
    EDIT: 'edit_role',
    GET_ALL: 'get_all_roles',
    GET_DETAILS: 'get_details_role',
    DELETE: 'delete_role',
    ALL: [
      'add_role',
      'edit_role',
      'get_all_roles',
      'get_details_role',
      'delete_role',
    ],
  },
  USERS: {
    ADD: 'add_user',
    EDIT: 'edit_user',
    GET_ALL: 'get_all_users',
    GET_DETAILS: 'get_details_user',
    DELETE: 'delete_user',
    ALL: [
      'add_user',
      'edit_user',
      'get_all_users',
      'get_details_user',
      'delete_user',
    ],
  },
  PROJECTS: {
    ADD: 'add_project',
    EDIT: 'edit_project',
    GET_ALL: 'get_all_projects',
    GET_DETAILS: 'get_details_project',
    DELETE: 'delete_project',
    ALL: [
      'add_project',
      'edit_project',
      'get_all_projects',
      'get_details_project',
      'delete_project',
    ],
  },
  TASKS: {
    ADD: 'add_task',
    EDIT: 'edit_task',
    GET_ALL: 'get_all_tasks',
    GET_DETAILS: 'get_details_task',
    DELETE: 'delete_task',
    ALL: [
      'add_task',
      'edit_task',
      'get_all_tasks',
      'get_details_task',
      'delete_task',
    ],
  },
  COMMENTS: {
    ADD: 'add_comment',
    EDIT: 'edit_comment',
    GET_ALL: 'get_all_comments',
    GET_DETAILS: 'get_details_comment',
    DELETE: 'delete_comment',
    ALL: [
      'add_comment',
      'edit_comment',
      'get_all_comments',
      'get_details_comment',
      'delete_comment',
    ],
  },
};

export const validRights = (rights: string[]) => {
  const permissions = new Set();

  for (const module in Rights) {
    if (!Object.prototype.hasOwnProperty.call(Rights, module)) continue;

    const allRights = Rights[module]['ALL'];
    if (Array.isArray(allRights) && allRights.length > 0) {
      allRights.forEach((value) => permissions.add(value));
    }
  }
  const accessRights = rights;
  if (accessRights.length > 0) {
    const validRights = accessRights.every((right) => permissions.has(right));
    if (!validRights) throw new AppError('Invalid Rights', 400);
  }
  return true;
};
