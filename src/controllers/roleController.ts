import { catchAsync } from '../utils/catchAsync';
import {
  listAllRoles,
  listRoleById,
  createRole,
  deleteRole,
  updateRole,
  listRoleByName,
} from '../services/roleService';

export const getAllRoles = catchAsync(async (req, res, next) => {
  const roles = await listAllRoles();

  res.status(200).json({
    status: 'success',
    data: roles,
  });
});

export const getRole = catchAsync(async (req, res, next) => {
  const role = await listRoleById(req.params.id);

  res.status(200).json({
    status: 'success',
    role,
  });
});

export const getRoleByName = catchAsync(async (req, res, next) => {
  const role = await listRoleByName(req.body.name);

  res.status(200).json({
    status: 'success',
    role,
  });
});

export const createRoles = catchAsync(async (req, res, next) => {
  const { role, name, description, rights } = req.body;
  const newRole = await createRole({ role, name, description, rights });

  res.status(201).json({
    status: 'success',
    newRole,
  });
});

export const updateRoles = catchAsync(async (req, res, next) => {
  const roleId = req.params.id;
  const role = await updateRole(roleId, req.body);

  res.status(200).json({
    status: 'success',
    role,
  });
});

export const deleteRoles = catchAsync(async (req, res, next) => {
  const roleId = req.params.id;

  const delRole = await deleteRole(roleId);
  res.status(200).json({
    status: 'success',
    message: 'Role deleted Successfully',
  });
});
