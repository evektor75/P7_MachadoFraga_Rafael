//Import
const jwt = require('jsonwebtoken');
const JWT_SIGN_SECRET = '$2y$10$HjZKDFIqaCKFeqsSyNs9beqHaEtNEmvgYHNGqknh7tXbVESB1mmPy';

//Fonction à exporter


module.exports = {
    jwtTokenSign : '$2y$10$HjZKDFIqaCKFeqsSyNs9beqHaEtNEmvgYHNGqknh7tXbVESB1mmPy',
    generateTokenForUser: function (userData) {
        return jwt.sign({
            userId: userData.id,
            isAdmin: userData.isAdmin
        },
            this.jwtTokenSign,
            {
                expiresIn: '24h'
            })
    },
    getUserId: function (data) {
        if (data.length > 1) {
            let token = data.split(' ')[1];
            try {
                let decodedToken = jwt.verify(token, this.jwtTokenSign)
                userId = decodedToken.userId
                return userId
            }
            catch (err) {
                return err
            }
        };
    }
}
