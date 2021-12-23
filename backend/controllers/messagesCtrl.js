//Imports
const models = require('../models');
const jwtUtils = require('../utils/jwt.utils');
const fs = require('fs');



//Constantes
const CONTENT_REGEX = /^[a-zA-Z0-9 ,.!?'éèàç]*$/;
//Routes

//Création d'un Post
exports.createMessage = (req, res, next) => {
    //identification de l'utilisateur
    const userId = jwtUtils.getUserId(req.headers.authorization);

    //Params
    let title = req.body.title;
    let content = req.body.content;
    let urlAttachment;

    if (title == null || content == null) {
        return res.status(400).json({ 'error': 'Champ manquant' });
    }
    if (title.length <= 2 || content.length <= 4) {
        return res.status(400).json({ 'error': 'Le titre et le contenu doivent contenir respectivement 2 et 4 caractères au minimum' });
    }
    if (!CONTENT_REGEX.test(content)) {
        return res.status(400).json({ 'error': 'Pas de caractères spéciaux' });
    }
    if (!CONTENT_REGEX.test(title)) {
        return res.status(400).json({ 'error': 'Pas de caractères spéciaux' });
    }

    models.User.findOne({
        attributes: ['id', 'email', 'username'],
        where: { id: userId }
    })
        .then(function (userFound) {
            if (userFound !== null) {
                if (req.file != undefined) {
                    urlAttachment = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
                } else {
                    urlAttachment == null;
                };
                if ((content == 'null' && title == null)) {
                    res.status(400).json({ 'error': 'Impossible de publier car rien est rempli' })
                } else {
                    console.log(urlAttachment);
                    models.Message.create({
                        title: title,
                        content: content,
                        attachment: urlAttachment,
                        likes: 0,
                        userId: userFound.id
                    })
                        .then(function (newMessage) {
                            if (newMessage) {
                                return res.status(201).json(newMessage);
                            } else {
                                return res.status(500).json({ 'error': 'impossible de poster' });
                            }
                        })
                };


            } else {
                res.status(404).json({ 'error': 'utilisateur introuvable' });
            }

        })
        .catch(function (err) {
            return res.status(500).json({ 'error': 'vérification impossible' + err });
        })
}


//Lister les posts
exports.listMessages = (req, res, next) => {
    models.Message.findAll({
        include: [{
            model: models.User
        },
        {
            model: models.Comment,
            include: {
                model: models.User,
                attributes: ['id', 'username', 'isAdmin']
            },
        },
        {
            model: models.Like
        }
        ],

        order: [['createdAt', 'DESC']]
    })
        .then(posts => {
            if (posts.length > null) {
                res.status(200).json(posts);
            } else {
                res.status(404).json({ 'error': 'Pas de message à afficher' });
            }
        })
        .catch(err => res.status(500).json(err))
}


//Supprimer un post
exports.delete = (req, res, next) => {
    let userOrder = req.body.userIdOrder;
    let userId = jwtUtils.getUserId(req.headers.authorization);

    models.User.findOne({
        where: { id: userId }
    })
        .then(user => {
            if (user && (user.isAdmin == true || user.id == userOrder)) {
                console.log(req.params.id);
                models.Message.findOne({
                    where: { id: req.params.id }
                })
                    .then(messageFound => {
                        //Gestion du cas avec image 
                        if (messageFound.attachment) {
                            const filename = messageFound.attachment.split("/images/")[1]; //Récuperation du nom de l'image
                            fs.unlink(`images/${filename}`, () => {
                                models.Comment.destroy({
                                    where: { messageId: messageFound.id }
                                }),
                                    models.Like.destroy({
                                        where: { messageId: messageFound.id }
                                    }),
                                    models.Message.destroy({
                                        where: { id: messageFound.id }
                                    })
                                        .then(() => res.end())
                                        .catch(err => res.status(500).json(err))
                            })
                        } else {
                            //Gestion du cas sans image
                            models.Comment.destroy({
                                where: { messageId: messageFound.id }
                            }),
                                models.Like.destroy({
                                    where: { messageId: messageFound.id }
                                }),
                                models.Message.destroy({
                                    where: { id: messageFound.id }
                                })
                                    .then(() => res.end())
                                    .catch(err => res.status(500).json(err))
                        }
                    })
                    .catch(err => res.status(400).json({ 'err': 'impossible de trouver le message' + err }))
            } else {
                res.status(400).json({ 'err': ` L'utilisateur n'est pas autorisé à supprimer le message` });
            }
        })
        .catch(err => res.status(400).json({ err }))

}