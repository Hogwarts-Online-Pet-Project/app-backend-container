import jwt from 'jsonwebtoken'
import { findUserById } from './users/users.services.js'
import bcrypt from 'bcrypt';
const teacher_trusted_routes = [
    "/api/v1/crud/course/",
    "/api/v1/crud/lection/",
    "/api/v1/crud/questions/",
    "/api/v1/crud/tests/",
    "/api/v1/crud/test_questions/",
]

// TODO: reorganiza middleware
async function everything(req, res, next) {
    if (req.url.includes('/crud/')) {
        try {
            // next()
            isAuthenticated(req, res, async () => {
                let user = await findUserById(req.payload.userId)
                if (user?.Role_user_User != 3 && user?.Role_user_User != 2) {
                    res.status(401);
                    next(new Error('🚫 Недостаточно прав на использование ресурса 🚫'));
                }
                if (user?.Role_user_User == 2 && !teacher_trusted_routes.includes(req.url)) {
                    res.status(401);
                    next(new Error('🚫 Недостаточно прав на использование ресурса 🚫'));
                }

                if (req.payload.Deadline_test ||
                    req.payload.Date_start_Contract ||
                    req.payload.Date_end_Contract ||
                    req.payload.Password_User ||
                    req.payload.Date_of_birth) {
                    let { Deadline_test, Date_start_Contract, Date_end_Contract, Date_of_birth, Password_User } = req.payload
                    Deadline_test ? req.payload.Deadline_test = new Date(Date.parse(Deadline_test)).toISOString() : 0
                    Date_start_Contract ? req.payload.Date_start_Contract = new Date(Date.parse(Date_start_Contract)).toISOString() : 0
                    Date_end_Contract ? req.payload.Date_end_Contract = new Date(Date.parse(Date_end_Contract)).toISOString() : 0
                    Date_of_birth ? req.payload.Date_of_birth = new Date(Date.parse(Date_of_birth)).toISOString() : 0
                    Password_User ? req.payload.Password_User = await bcrypt.hash(Password_User, 10) : 0
                } else if (req.body.Deadline_test ||
                    req.body.Date_start_Contract ||
                    req.body.Date_end_Contract ||
                    req.body.Password_User ||
                    req.body.Date_of_birth) {
                    let { Deadline_test, Date_start_Contract, Date_end_Contract, Date_of_birth, Password_User } = req.body
                    Deadline_test ? req.body.Deadline_test = new Date(Date.parse(Deadline_test)).toISOString() : 0
                    Date_start_Contract ? req.body.Date_start_Contract = new Date(Date.parse(Date_start_Contract)).toISOString() : 0
                    Date_end_Contract ? req.body.Date_end_Contract = new Date(Date.parse(Date_end_Contract)).toISOString() : 0
                    Date_of_birth ? req.body.Date_of_birth = new Date(Date.parse(Date_of_birth)).toISOString() : 0
                    Password_User ? req.body.Password_User = await bcrypt.hash(Password_User, 10) : 0
                }
                if (req.url.includes('refreshTokens')) {
                    req.url = req.url.replace("refreshTokens", "RefreshToken")
                } else if (!req.url.includes("RefreshToken")) {
                    req.url = req.url.toLocaleLowerCase()
                    if (!req.url.includes("student_course") && !req.url.includes("log_") && req.url.includes("student")) {
                        req.url = req.url.replace("student", "users")
                    }
                }
                next()
            })
        } catch (auth_error) {
            next(auth_error)
        }
    } else { next() }

}

function notFound(req, res, next) {
    res.status(404);
    const error = new Error(`🔍 - Путь не найден - ${req.originalUrl}`);
    next(error);
}

/* eslint-disable no-unused-vars */
function errorHandler(err, req, res, next) {
    /* eslint-enable no-unused-vars */
    const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
    res.status(statusCode);
    res.json({
        message: err.message,
        // stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack
    });
}

function isAuthenticated(req, res, next) {
    const { authorization } = req.headers;

    if (!authorization) {
        res.status(401);
        throw new Error('🚫 Не авторизован 🚫');
    }

    try {
        const token = authorization.split(' ')[1];
        const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        req.payload = payload;
    } catch (err) {
        res.status(401);
        if (err.name === 'TokenExpiredError') {
            throw new Error(err.name);
        }
        throw new Error('🚫 Не авторизован 🚫');
    }

    return next();
}

export {
    notFound,
    errorHandler,
    isAuthenticated,
    everything
};