//Imports 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtUtils = require('../utils/jwt.utils');
const models = require('../models');

// Constantes
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
const BIO_REGEX = /^([a-z]|[A-Z]|[0-9,;.]){4,8}$/;

//Fonctions

//S'inscire
exports.signup = (req, res, next) => {
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    const bio = req.body.bio;

    if (email == null || username == null || password == null) {
        return res.status(400).json({ 'error': 'il manque au moins un paramètre' });
    }

    if (username.lenght >= 15 || username.lenght <= 5) {
        return res.status(400).json({ 'error': 'le pseudo doit etre compris entre 5 et 15 caractères' });
    }

    if (!EMAIL_REGEX.test(email)) {
        return res.status(400).json({ 'error': 'email invalide' });

    }

    if (!PASSWORD_REGEX.test(password)) {
        return res.status(400).json({ 'error': 'mot de passe invalide (il doit contenir au moins 8 caractères dont 1 chiffre, une lettre et un caractère spécial' });
    }

    if (BIO_REGEX.test(bio)) {
        return res.status(400).json({ 'error': 'Pas de caractères spéciaux!' });
    }


    models.User.findOne({
        attributes: ['email'],
        where: {
            email: email
        }
    })
        .then(function () {
            models.User.findOne({
                attributes: ['username'],
                where: { username: username }
            })
                .then(function (userFound) {
                    if (!userFound) {

                        bcrypt.hash(password, 5, function (err, bcryptedPassword) {
                            const newUser = models.User.create({
                                email: email,
                                username: username,
                                password: bcryptedPassword,
                                bio: bio,
                                isAdmin: 0
                            })
                                .then(function (newUser) {
                                    return res.status(201).json({ 'userId': newUser.id });
                                })
                                .catch(function (err) {
                                    return res.status(500).json({ 'error': `impossible d'ajouter l'utilisateur` });
                                });

                        });

                    } else {
                        return res.status(400).json({ 'error': `utilisateur existant` });
                    }
                })

        })

        .catch(function (err) {
            return res.status(500).json({ 'error': `impossible de vérifier l'utilisateur` });
        });


}

//Se connecter
exports.login = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    if (email == null || password == null) {
        return res.status(400).json({ 'error': 'parametres manquants' });
    }




    models.User.findOne({
        where: { email: email }
    })
        .then(function (userFound) {
            if (userFound) {

                bcrypt.compare(password, userFound.password, function (errBycrypt, resBycrypt) {
                    if (resBycrypt) {
                        return res.status(200).json({
                            'userId': userFound.id,
                            'token': jwtUtils.generateTokenForUser(userFound)
                        });
                    } else {
                        return res.status(403).json({ 'error': 'mot de passe invalide' });
                    }
                });

            } else {
                return res.status(404).json({ 'error': `Adresse mail inconnue au bataillon` });
            }

        })
        .catch(function (err) {
            return res.status(500).json({ 'error': `impossible de vérifier l'utilisateur` });
        });

};

//Obtenir un profil

exports.getUserProfile = (req, res, next) => {
    const userId = jwtUtils.getUserId(req.headers.authorization);
    models.User.findOne({
        attributes: ['id', 'email', 'username', 'bio'],
        where: { id: userId }
    })
        .then(user => res.status(200).json({ user }))
        .catch(function (err) {
            res.status(500).json({ 'error': `impossible d'accéder à l'utilisateur` + err });
        });

}

//Modifier un compte
exports.updateAccount = async(req, res, next) => {
    const userId = jwtUtils.getUserId(req.headers.authorization);

    //Params
    const bio = req.body.bio;
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;

    try {
        if (bio) {
            if (BIO_REGEX.test(bio)) {
                models.User.findOne({
                    attributes: ['id', 'bio'],
                    where: { id: userId }
                })
                    .then(userFound => {
                        if (userFound) {
                            userFound.update({
                                bio: (bio ? bio : userFound.bio)

                            })
                                .then(() => {
                                    if (userFound) {
                                        return res.status(201).json(userFound);

                                    } else {
                                        return res.status(501).json({ 'error': 'impossible de metre a jour la bio' });
                                    }
                                })
                                .catch(() => res.status(500).json({ 'error': `impossible d'actualiser la bio` }))
                        } else {
                            return res.status(404).json({ 'error': 'utilisateur introuvable' });
                        }
                    })
                    .catch(err => {
                        return res.status(500).json({ 'error': `utilisateur non trouvés` + err });
                    })
            } else {
                return res.status(500).json({ 'error': 'bio regex impossible' });
            }
        }

        if (email) {
            if (EMAIL_REGEX.test(email)) {
                models.User.findOne({
                    attributes: ['id', 'email'],
                    where: { id: userId }
                })
                    .then(userFound => {
                        console.log(userFound.email);
                        if (userFound.email == email) {
                            return res.status(500).json({ 'error': 'les emails sont identiques' });
                        } else {
                            userFound.update({
                                email: (email ? email : userFound.email)
                            })
                                .then(() => {
                                    if (userFound) {
                                        return res.status(201).json(userFound);
                                    } else {
                                        return res.status(500).json({ 'error': 'impossible de metre a jour email' });
                                    }
                                })
                                .catch(err => res.status(502).json(err))
                        }
                    })
                    .catch(err => {
                        return res.status(500).json({ 'error': `impossible de trouver l'utilisateur` + err });
                    })
            } else {
                return res.status(404).json({ 'error': 'utilisateur introuvable' });
            }
        }

        if (username) {
            if (BIO_REGEX.test(username)) {
                models.User.findOne({
                    attributes: ['id', 'username'],
                    where: { id: userId }
                })
                    .then(userFound => {
                        console.log(userFound.username);
                        if (userFound.username == username) {
                            return res.status(500).json({ 'error': 'les pseudos sont identiques' });
                        } else {
                            userFound.update({
                                username: (username ? username : userFound.username)
                            })
                                .then(() => {
                                    if (userFound) {
                                        return res.status(201).json(userFound);
                                    } else {
                                        return res.status(500).json({ 'error': 'impossible de metre a jour le pseudo' });
                                    }
                                })
                                .catch(err => res.status(502).json(err))
                        }
                    })
                    .catch(err => {
                        return res.status(500).json({ 'error': `impossible de trouver l'utilisateur` + err });
                    })
            } else {
                return res.status(404).json({ 'error': 'utilisateur introuvable' });
            }
        }


        if (password) {
            if (PASSWORD_REGEX.test(password)) {
                models.User.findOne({
                    attributes: ['id', 'username'],
                    where: { id: userId }
                })
                    .then(userFound => {
                        bcrypt.compare(password, userFound.password, (resCompare) => {
                            if (resCompare) {
                                return res.status(400).json({ 'error': 'Les mots de passes sont identiques' });
                            } else {
                                bcrypt.hash(newPassword, 10, function (err, bcryptNewPassword) {
                                    models.User.update({ password: bcryptNewPassword },
                                        { where: { id: userId } })
                                        .then(() => res.status(201).json({ 'message': 'Mot de passe modifié' }))
                                        .catch(err => res.status(500).json({ 'error': err }))
                                })

                            }
                        })
                    })
                    .catch(err => {
                        return res.status(500).json({ 'error': `impossible de trouver l'utilisateur` + err });
                    })

            } else {
                return res.status(404).json({ 'error': 'utilisateur introuvable' });
            }
        }

    }
    catch {
        return res.status(404);
    }


}




//Supprimer profil
exports.deleteUser = (req, res, next) => {
    let userId = jwtUtils.getUserId(req.headers.authorization);
    if (userId != null) {
        models.User.findOne({
            where: { id: userId }
        })
            .then(userFound => {
                models.Message.destroy({
                    where: { userId: userFound.id }
                })
                    .then(() => {
                        models.User.destroy({
                            where: { id: userFound.id }
                        })
                            .then(res.status(200).json('utilisateur supprimé'))
                            .catch(() => res.status(500).json('immpossible de supprimer ' + userFound))
                    })
                    .catch(err => res.status(500).json(err))
            })
            .catch(err => res.status(500).json({ 'error': 'utilisateur introuvable' }))

    } else {
        res.status(404).json({ 'error': 'utilisateur inexistant' })
    }
}

