import jwt from 'jsonwebtoken'

function generateAccessToken(user) {
    return jwt.sign({ userId: user.ID_User }, process.env.JWT_ACCESS_SECRET, {
        expiresIn: '10m',
    });
}

function generateRefreshToken(user, jti) {
    return jwt.sign({
        userId: user.ID_User,
        jti
    }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: '8h',
    });
}

function generateTokens(user, jti) {
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user, jti);

    return {
        accessToken,
        refreshToken,
    };
}

export {
    generateAccessToken,
    generateRefreshToken,
    generateTokens
};