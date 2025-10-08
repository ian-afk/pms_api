import { Role } from '../db/models/roles';

interface OptionType {
  sortBy: string;
  sortOrder: string;
}

interface IUpdateRole {
  name?: string;
  description: string;
  rights: string;
}

export async function createRole({ role, name, description, rights }) {
  const newRole = new Role({
    role,
    name,
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

  return await Role.find(query).sort({ [sortBy]: order });
}

export async function listAllRoles(options?: OptionType) {
  return await listRoles({}, options);
}

export async function listRoleById(roleId: string, options?: OptionType) {
  return await listRoles({ _id: roleId });
}

export async function listRoleByName(name: string, options?: OptionType) {
  return await listRoles({ name }, options);
}

export async function updateRole(
  roleId: string,
  { name, description, rights }: IUpdateRole,
) {
  const columnUpdate = Object.fromEntries(
    Object.entries({ name, description, rights }).filter(
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
