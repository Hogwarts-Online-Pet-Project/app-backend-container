import express from 'express';

import auth from './auth/auth.routes.js';
import users from './users/users.routes.js';
import uploads from './uploads/uploads.routes.js';

import autoCrud from "@moreillon/prisma-auto-crud"
import { db } from "../utils/db.js"

const router = express.Router();

router.get('/', (req, res) => {
    res.json({
        message: 'API - 👋🌎🌍🌏'
    });
});

router.use(autoCrud.default(db));
router.use('/auth', auth);
router.use('/users', users);
router.use('/uploads', uploads);

export default router;