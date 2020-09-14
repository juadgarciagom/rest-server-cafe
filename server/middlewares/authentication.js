const jwt = require('jsonwebtoken');

/**
 * Verificar token de autenticación
 */

let checkToken = (req, res, next) => {
    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                message: err
            })
        };

        req.user = decoded.user;

        next();
    });

};

let checkAdminRole = (req, res, next) => {
    user = req.user

    if (user.role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.json({
            ok: false,
            error: {
                message: 'El usuario no esta autorizado para realizar cambios'
            }
        });
    };

};

module.exports = {
    checkToken,
    checkAdminRole
};