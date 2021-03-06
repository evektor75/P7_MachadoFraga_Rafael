//Imports
const models = require('../models');
const jwtUtils = require('../utils/jwt.utils');

//Constantes
const CONTENT_REGEX = /^([a-z]|[A-Z]|[0-9,;.]){4,8}$/;


//Fonctions
//Fonction de commentaire 

//Création du commentaire
exports.comment = (req, res, next) => {

    //identification de l'utilisateur
    let userId = jwtUtils.getUserId(req.headers.authorization);
    //Params
    const newComment = req.body.content;
    

    if (newComment == null) {
        return res.status(400).json({ 'error': 'Champ manquant' });
    }
    if (CONTENT_REGEX.test(newComment)) {
        return res.status(400).json({ 'error': 'Pas de caractères spéciaux' });
    }

    models.Comment.create({
        messageId: req.body.messageId,
        userId: userId,
        content: req.body.content
    })
        .then(comment => {
            res.status(201).json({ comment })
        })
        .catch(err => res.status(500).json({ err }))


}

//Suppression du commentaire 

exports.deleteComment = (req, res, next) => {
    let userOrder = req.body.userIdOrder;
    let userId = jwtUtils.getUserId(req.headers.authorization);
   
    models.User.findOne({
        attributes: ["id", "email", "username", "isAdmin"],
        where: { id: userId }
    })
        .then(userFound => {
            if (userFound && (userFound.isAdmin == true || userFound.id == userOrder)) {
                console.log("Suppresion du commentaire : ", req.params.id);
                models.Comment.findOne({
                    where: { id: req.params.id }
                })
                    .then(commentFound => {
                        models.Comment.destroy({
                            where: { id: commentFound.id }
                        })
                            .then(() => res.status(200).json({ 'message': 'commentaire supprimé' }))
                            .catch(err => res.status(500).json({ 'error': 'impoosible de supprimer le com' + err }))
                    })
                    .catch(err => res.status(500).json({ 'error': 'commentaire introuvable' }))
            } else {

            }
        })
        .catch(err => res.status(400).json({ 'error': 'utilisateur introuvable' + err }))
}