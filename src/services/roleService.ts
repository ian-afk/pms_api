import { Types } from 'mongoose';
import { Role } from '../db/models/roles';
import { AppError } from '../utils/AppError';

import { OptionType } from '../types/commonType';

interface IUpdateRole {
  role?: string;
  description?: string;
  rights?: string;
}

export async function createRole({ role, description, rights }) {
  const newRole = new Role({
    role,
    description,
    rights,
  });

  return await newRole.save();
}

export async function listRoles(
  query = {},
  { sortBy = 'createdAt', sortOrder = 'descending' } = {},
) {
  const order = sortOrder === 'descending' ? -1 : 1;

  const sortField = sortBy || 'createdAt';

  const filter: Record<string, any> = {};

  for (const key in query) {
    console.log(key);
    if (key !== 'sortBy' && key !== 'sortOrder') {
      filter[key] = { $regex: query[key], $options: 'i' };
    }
  }
  console.log(filter);
  const role = await Role.find(filter).sort({ [sortField]: order });
  console.log(role);
  return role;
}

export async function listAllRoles(query, options?: OptionType) {
  return await listRoles(query, options);
}

export async function getRoleById(roleId: string, options?: OptionType) {
  if (!Types.ObjectId.isValid(roleId)) {
    throw new AppError('Invalid roleId', 400);
  }

  const role = await Role.findById({ _id: roleId }).lean();
  if (!role) throw new AppError(`Role ID doesn't exists`, 404);
  return role;
}

export async function getRoleByName(name: string, options?: OptionType) {
  return await listRoles({ role: name }, options);
}

export async function updateRole(
  roleId: string,
  { role, description, rights }: IUpdateRole,
) {
  const columnUpdate = Object.fromEntries(
    Object.entries({ role, description, rights }).filter(
      ([_, v]) => v !== undefined,
    ),
  );
  return await Role.findOneAndUpdate(
    {
      _id: roleId,
    },
    {
      $set: columnUpdate,
    },
    { new: true },
  );
}

export async function deleteRole(roleId: string) {
  return await Role.deleteOne({ _id: roleId });
}
