import jwt from 'jsonwebtoken'
import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { generateTokens } from '../../utils/jwt.js';

import bcrypt from 'bcrypt';

import {
    addRefreshTokenToWhitelist, findRefreshTokenById, deleteRefreshToken,
} from './auth.services.js';
import { hashToken } from '../../utils/hashToken.js';


import {
    findUserByEmail,
    createUserByEmailAndPassword,
    findUserById,
} from '../users/users.services.js';

const router = express.Router();

router.post('/register', async (req, res, next) => {
    try {
        let { Last_name_User,
            First_name_User,
            Middle_name_User,
            Email_User,
            Role_user_User,
            Date_of_birth,
            Sex_User,
            Password_User, } = req.body;
        if (
            !Last_name_User ||
            !First_name_User ||
            !Middle_name_User ||
            !Email_User ||
            !Role_user_User ||
            !Date_of_birth ||
            !Sex_User ||
            !Password_User
        ) {
            res.status(400);
            throw new Error('Заполнены не все поля.');
        }

        const existingUser = await findUserByEmail(Email_User);

        if (existingUser) {
            res.status(400);
            throw new Error('Почта уже используется.');
        }

        try {
            Date_of_birth = new Date(Date_of_birth).toISOString()
        } catch (error) {
            throw new Error('Некорректно указана дата рождения.');
        }

        const user = await createUserByEmailAndPassword({
            Last_name_User,
            First_name_User,
            Middle_name_User,
            Email_User,
            Role_user_User,
            Date_of_birth,
            Sex_User,
            Password_User,
        });
        const jti = uuidv4();
        const { accessToken, refreshToken } = generateTokens(user, jti);
        await addRefreshTokenToWhitelist({ jti, refreshToken, userId: user.ID_User });

        res.json({
            accessToken,
            refreshToken,
        });
    } catch (err) {
        next(err);
    }
});

router.post('/login', async (req, res, next) => {
    try {
        const { Email_User, Password_User } = req.body;
        if (!Email_User || !Password_User) {
            res.status(400);
            throw new Error('Заполнены не все данные.');
        }

        const existingUser = await findUserByEmail(Email_User);

        if (!existingUser) {
            res.status(403);
            throw new Error('Указаны неверные данные.');
        }

        const validPassword = bcrypt.compareSync(Password_User, existingUser.Password_User);
        if (!validPassword) {
            res.status(403);
            throw new Error('Указаны неверные данные.');
        }

        const jti = uuidv4();
        const { accessToken, refreshToken } = generateTokens(existingUser, jti);
        await addRefreshTokenToWhitelist({ jti, refreshToken, userId: existingUser.ID_User });

        res.json({
            accessToken,
            refreshToken
        });
    } catch (err) {
        next(err);
    }
});

router.post('/refreshToken', async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            res.status(400);
            throw new Error('Отсутствует маркер доступа.');
        }
        const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const savedRefreshToken = await findRefreshTokenById(payload.jti);

        if (!savedRefreshToken || savedRefreshToken.revoked === true) {
            res.status(401);
            throw new Error('Нет доступа');
        }

        const hashedToken = hashToken(refreshToken);
        if (hashedToken !== savedRefreshToken.hashedToken) {
            res.status(401);
            throw new Error('Нет доступа');
        }

        const user = await findUserById(payload.userId);
        if (!user) {
            res.status(401);
            throw new Error('Нет доступа');
        }

        await deleteRefreshToken(savedRefreshToken.id);
        const jti = uuidv4();
        const { accessToken, refreshToken: newRefreshToken } = generateTokens(user, jti);
        await addRefreshTokenToWhitelist({ jti, refreshToken: newRefreshToken, userId: user.ID_User });

        res.json({
            accessToken,
            refreshToken: newRefreshToken
        });
    } catch (err) {
        next(err);
    }
});

export default router;