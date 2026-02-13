import express from 'express';
import * as componentsController from '../controllers/components.controller.js';

const router = express.Router();

// Component endpoints
router.get('/', componentsController.getAll);
router.post('/', componentsController.create);
router.get('/:id', componentsController.getById);
router.put('/:id', componentsController.update);
router.delete('/:id', componentsController.remove);

export default router;
