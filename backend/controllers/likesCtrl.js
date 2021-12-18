//Imports
const models = require('../models');
const jwtUtils = require('../utils/jwt.utils');


//Constants



//Fonctions
//fonction Like
exports.like = (req, res, next) => {
    //recupération de l'id
    const userId = jwtUtils.getUserId(req.headers.authorization);


    models.User.findOne({
        where: { id: userId }

    })
        .then(userFound => {
            if (userFound) {
                console.log(userId);
                models.Like.findOne({
                    where: {
                        userId: userId,
                        messageId: req.body.messageId
                    }
                })
                    .then(userAlreadyLiked => {
                        if (userAlreadyLiked) {
                            models.Like.destroy({
                                where: { id: userAlreadyLiked.id}
                            })
                            .then(() => res.status(200).json({ 'message' : 'like retiré'}))
                            .catch(err => res.status(500).jspn({'error' : 'impossible de retiré le like'}))

                        } else {
                            models.Like.create({
                                userId: userId,
                                messageId: req.body.messageId
                            })
                                .then(() => {
                                    res.status(201).json({ 'message': ' like créé' })
                                })
                                .catch(err => res.status(500).json({ 'error': 'impossible de liké ' + err }));

                        }

                    })
                    .catch(err => res.status(500).json({ 'error': `impossible de vérifier si l'user à déja aimé` + err }))
                    ;
            } else {
                res.status(404).json({ 'error': `l'utilisateur n'existe pas` });
            }

        })
        .catch(err => res.status(500).json({ 'error': `impossible de vérifier l'utilisateur` + err }));

}



//Fonction dislike

exports.dislike = (req, res, next) => {
    //recupération de l'id
    const userId = jwtUtils.getUserId(req.headers.authorization);


    //Params
    const messageId = parseInt(req.params.messageId);

    if (messageId <= 0) {
        return res.status(400).json({ 'error': 'paramètres invalides' })
    }
    models.Message.findOne({
        where: { id: messageId }
    })
        .then(messageFound => {
            if (messageFound) {
                models.User.findOne({
                    where: { id: userId }

                })
                    .then(userFound => {
                        if (userFound) {
                            models.Dislike.findOne({
                                where: {
                                    userId: userId,
                                    messageId: messageId
                                }
                            })
                                .then(userAlreadyDisliked => {
                                    if (userAlreadyDisliked) {
                                        res.status(409).json({ 'error': 'message déja dislike' });

                                    } else {
                                        models.Dislike.create({
                                            messageId: messageId,
                                            userId: userId
                                        })
                                            .then(() => {
                                                if (messageFound) {
                                                    res.status(201).json(messageFound)
                                                } else {
                                                    res.status(500).json({ 'error': 'impossible de mettre à jour le message' });
                                                }
                                            })
                                            .catch(err => res.status(500).json({ 'error': 'impossible de mettre à jour le compteur ' + err }));

                                    }

                                })
                                .catch(err => res.status(500).json({ 'error': `impossible de vérifier si l'user à déja aimé` + err }))
                                ;
                        } else {
                            res.status(404).json({ 'error': `l'utilisateur n'existe pas` });
                        }

                    })
                    .catch(err => res.status(500).json({ 'error': `impossible de vérifier l'utilisateur` + err }));
            } else {
                res.status(404).json({ 'error': 'message déjà disliké' })
            }
        })
        .catch(err => res.status(500).json({ 'error': 'impossible de vérifier le message' + err }));

}

//Retirer like 
exports.removeLike = (req, res, next) => {
    //recupération de l'id
    const userId = jwtUtils.getUserId(req.headers.authorization);


    //Params
    const messageId = parseInt(req.params.messageId);

    if (messageId <= 0) {
        return res.status(400).json({ 'error': 'paramètres invalides' })
    }

    models.Message.findOne({
        where: { id: messageId }
    })
        .then(messageFound => {
            if (messageFound) {
                models.User.findOne({
                    where: { id: userId }

                })
                    .then(userFound => {
                        if (userFound) {
                            models.Like.findOne({
                                where: {
                                    userId: userId,
                                    messageId: messageId
                                }
                            })
                                .then(userAlreadyLiked => {
                                    if (userAlreadyLiked) {
                                        models.Like.destroy({
                                            where: {
                                                messageId: messageId,
                                                userId: userId
                                            }
                                        }
                                        )
                                            .then(() => res.status(200).json({ 'message': 'like retiré' }))
                                            .catch(err => res.status(500).json({ 'error': 'impossible de retirer le like' + err }))

                                    } else {
                                        res.status(400).json({ 'error': `l'utilisateur n'a pas encore liké` })
                                    }

                                })
                                .catch(err => res.status(500).json({ 'error': `impossible de vérifier si l'user à déja aimé` + err }))
                                ;
                        } else {
                            res.status(404).json({ 'error': `l'utilisateur n'existe pas` });
                        }

                    })
                    .catch(err => res.status(500).json({ 'error': `impossible de vérifier l'utilisateur` + err }));
            } else {
                res.status(404).json({ 'error': 'message déjà liké' })
            }
        })
        .catch(err => res.status(500).json({ 'error': 'impossible de vérifier le message' + err }));



}

