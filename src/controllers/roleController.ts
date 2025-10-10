import { catchAsync } from '../utils/catchAsync';
import {
  listAllRoles,
  getRoleById,
  createRole,
  deleteRole,
  updateRole,
  getRoleByName,
} from '../services/roleService';

export const getAllRoles = catchAsync(async (req, res, next) => {
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

export const getRole = catchAsync(async (req, res, next) => {
  const role = await getRoleById(req.params.id);

  res.status(200).json({
    status: 'success',
    role,
  });
});

export const getRolesByName = catchAsync(async (req, res, next) => {
  const role = await getRoleByName(req.body.name);

  res.status(200).json({
    status: 'success',
    role,
  });
});

export const createRoles = catchAsync(async (req, res, next) => {
  const { role, description, rights } = req.body;
  const newRole = await createRole({ role, description, rights });

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
