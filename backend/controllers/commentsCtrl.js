//Imports
const models = require('../models');
const jwtUtils = require('../utils/jwt.utils');

//Constantes
const CONTENT_REGEX = /^([a-z]|[A-Z]|[0-9,;.]){4,8}$/;


//Fonctions
    //Fonction de commentaire 

exports.comment = (req, res, next) => {
    
    //identification de l'utilisateur
    const userId = jwtUtils.getUserId(req.headers.authorization);

    //Params
    const comment = req.body.comment;
    const messageId = parseInt(req.params.messageId);


    if (comment == null) {
        return res.status(400).json({ 'error': 'Champ manquant' });
    }
    if (CONTENT_REGEX.test(comment)) {
        return res.status(400).json({ 'error': 'Pas de caractères spéciaux' });
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
                            console.log('le messagId est = ' + messageId);
                            models.Comment.create({
                                messageId: messageId,
                                userId: userId,
                                content: comment
                            })
                                .then(newComment => {
                                            console.log(newComment.content);
                                            models.Message.update({
                                                where: {
                                                    messageId: messageId,
                                                    userId: userId,
                                                },
                                                comment: newComment.content
                                            })
                                            .then( () => res.status(200).json({'message': 'commentaire actualisé'}))
                                            .catch( (err) => res.status(500).json({'error' : 'impossible de mettre a jour le com ' + err}))
                                        
        
                                   
                                })
                                    
    
                                .catch(err => res.status(500).json(err))

                        } else {
                            res.status(404).json({ 'error': 'utilisateur introuvable' });
                        }

                    })
                    .catch(function (err) {
                        return res.status(500).json({ 'error': 'vérification impossible' });
                    })

            }
        })
        .catch(err => res.status(500).json({ 'error': 'impossible de vérifier le message' + err }));
}