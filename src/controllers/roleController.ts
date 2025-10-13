import { catchAsync } from '../utils/catchAsync';
import {
  listAllRoles,
  findRoleById,
  createRole as createRoleService,
  deleteRole,
  updateRole,
  getRoleByName,
} from '../services/roleService';

export const getRoles = catchAsync(async (req, res) => {
  const { sortBy, sortOrder } = req.query as {
    sortBy?: string;
    sortOrder?: string;
    [key: string]: any;
  };
  const roles = await listAllRoles(req.query, { sortBy, sortOrder });

  res.status(200).json({
    status: 'success',
    data: roles,
  });
});

export const getRoleById = catchAsync(async (req, res) => {
  const role = await findRoleById(req.params.id);

  res.status(200).json({
    status: 'success',
    role,
  });
});

export const getRolesByName = catchAsync(async (req, res) => {
  const role = await getRoleByName(req.body.name);

  res.status(200).json({
    status: 'success',
    role,
  });
});

export const createRole = catchAsync(async (req, res) => {
  const { role, description, rights } = req.body;
  const newRole = await createRoleService({ role, description, rights });

  res.status(201).json({
    status: 'success',
    newRole,
  });
});

export const updateRoles = catchAsync(async (req, res) => {
  const roleId = req.params.id;
  const role = await updateRole(roleId, req.body);

  res.status(200).json({
    status: 'success',
    role,
  });
});

export const deleteRoles = catchAsync(async (req, res) => {
  const roleId = req.params.id;

  await deleteRole(roleId);
  res.status(200).json({
    status: 'success',
    message: 'Role deleted Successfully',
  });
});
