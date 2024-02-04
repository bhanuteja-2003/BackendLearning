import express from 'express';
import { deleteTask, newTask , updateTask, userTask } from '../controllers/task.js';
import { isAuthenticated } from '../middlewares/auth.js';

const router = express.Router();

router.get('/all',isAuthenticated, userTask )
router.post('/new',isAuthenticated,newTask)

router
    .route('/:id')
    .put(isAuthenticated,updateTask)
    .delete(isAuthenticated,deleteTask)

export default router;