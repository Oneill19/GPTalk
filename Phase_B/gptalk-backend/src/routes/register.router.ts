import router from './user.router';
import { registerMiddleware } from '../controllers/register.controller';
import { validator } from '../middlewares/validator.middleware';
import { validateUser } from '../pipes/validator.pipe';

/**
 * @route POST /api/register
 * @description register a user to the website
 * @access public
 */
router.post('/', validateUser, validator, registerMiddleware);

export default router;