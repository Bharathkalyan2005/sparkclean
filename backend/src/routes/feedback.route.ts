import { Router } from 'express';
import { authenticate, authorizeAdmin } from '../middleware/auth.middleware';
import { 
    getPublicFeedback, 
    getAllFeedback, 
    submitFeedback, 
    approveFeedback, 
    rejectFeedback, 
    featureFeedback, 
    deleteFeedback 
} from '../controllers/feedback.controller';

const router = Router();

// Public routes
router.get('/', getPublicFeedback);

// User routes
router.post('/', authenticate, submitFeedback);

// Admin routes
router.use(authenticate);
router.use(authorizeAdmin);

router.get('/all', getAllFeedback);
router.patch('/:id/approve', approveFeedback);
router.patch('/:id/reject', rejectFeedback);
router.patch('/:id/feature', featureFeedback);
router.delete('/:id', deleteFeedback);

export default router;
