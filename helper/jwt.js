const expressjwt = require('express-jwt')

function expressJwtAuthentication() {
    const secret = process.env.secret;
    const API = process.env.API_URL;
    return expressjwt({
        secret,
        algorithms: ['HS256'],
        isRevoked: revoked
    }).unless({
        path: [
            { url: /\/public\/uploads(.*)/, method: ['GET', "OPTIONS"] },
            { url: /\/api\/v1\/products(.*)/, method: ['GET', "OPTIONS"] },
            { url: /\/api\/v1\/categories(.*)/, method: ['GET', "OPTIONS"] },


            `${API}/users/login`,
            `${API}/users/register`,
        ]
    })
}

module.exports = expressJwtAuthentication;


async function revoked(req, payload, done) {
    if (!payload.isAdmin) {
        done(null, true)
    }
    done()
}