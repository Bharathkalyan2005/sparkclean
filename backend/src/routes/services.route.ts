import { Router } from 'express';
import { getAllServices, getComboServices } from '../controllers/services.controller';

const router = Router();

// Define /api/services routes based on PRD requirements
router.get('/', getAllServices);
router.get('/combos', getComboServices);

// Admin-only placeholder routes (we'll secure these later with JWT)
// router.post('/', createService);
// router.patch('/:id', updateService);
// router.delete('/:id', deactivateService);

export default router;
