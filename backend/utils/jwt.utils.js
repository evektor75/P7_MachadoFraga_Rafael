//Import
const jwt = require('jsonwebtoken');
require('dotenv').config();
//Fonction à exporter


module.exports = {
    jwtTokenSign : process.env.JWT_SIGN_SECRET,
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
        console.log(data);
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
