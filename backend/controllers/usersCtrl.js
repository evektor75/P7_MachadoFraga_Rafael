//Imports 
const bcrypt = require('bcrypt');
const jwtUtils = require('../utils/jwt.utils');
const models = require('../models');

// Constantes
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
const BIO_REGEX = /^[a-zA-Z0-9 ]*$/;

//Fonctions

//S'inscrire
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

    if (!BIO_REGEX.test(bio)) {
        return res.status(400).json({ 'error': 'Pas de caractères spéciaux!' });
    }

    if (!BIO_REGEX.test(username)) {
        return res.status(401).json({ 'error': 'Pas de caractères spéciaux!' });
    }


    models.User.findOne({
        attributes: ['email'],
        where: {
            email: email
        }
    })
        .then(function (userFound) {
            if(!userFound){
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
                        return res.status(400).json({ 'error': `pseudo existant` });
                    }
                })
        } else {
            res.status(501).json({ 'err': 'adresse email existante'})
        }
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
            return res.status(500).json({ 'error': `email incorrect` });
        });

};

//Obtenir un profil

exports.getUserProfile = (req, res, next) => {
    const userId = jwtUtils.getUserId(req.headers.authorization);
    models.User.findOne({
        attributes: ['id', 'email', 'username', 'bio', 'isAdmin'],
        where: { id: userId }
    })
        .then(user => res.status(200).json({ user }))
        .catch(function (err) {
            res.status(500).json({ 'error': `impossible d'accéder à l'utilisateur` + err });
        });

}

//Obtenir tous les profils
exports.getAllProfiles = (req, res, next) => {
    models.User.findAll({
        attributes: ['id', 'email', 'username', 'bio', 'isAdmin'],

    })
        .then(users => {
            res.status(200).json({ users })
        })
        .catch(err => {
            res.status(400).json({ err })
        })
}

//Supprimer un profil 
exports.deleteUserProfile = (req, res, next) => {
    let userOrder = req.body.userIdOrder;
    let userId = jwtUtils.getUserId(req.headers.authorization);

    models.User.findOne({
        attributes: ["id", "email", "username", "isAdmin"],
        where: { id: userId }
    })
        .then(userFound => {
            if (userFound && (userFound.isAdmin == true || userFound.id == userOrder)) {
                console.log("Suppression de l'utilisateur : ", req.params.id);
                models.User.findOne({
                    where: { id: req.params.id }
                })
                .then( user => {
                    models.User.destroy({
                        where: { id : user.id}
                    })
                    .then( () => res.status(200).json({'message' : 'utilisateur supprimé'}))
                    .catch(err => res.status(500).json({ 'err' : 'utilisateur non supprimé' + err}))
                })
                .catch(err => res.status(500).json({'err': `user introuvable` + err}))
            }
        })
        .catch(err => res.status(500).json({ err }))
}
