//Imports
const models = require('../models');
const jwtUtils = require('../utils/jwt.utils');




//Fonctions

//Fonction Like
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
                                where: { id: userAlreadyLiked.id }
                            })
                                .then((response) => res.status(200).json({ response }))
                                .catch(err => res.status(500).jspn({ 'error': 'impossible de retiré le like' }))

                        } else {
                            models.Like.create({
                                userId: userId,
                                messageId: req.body.messageId
                            })
                                .then(response => {
                                    res.status(201).json({ response })
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


