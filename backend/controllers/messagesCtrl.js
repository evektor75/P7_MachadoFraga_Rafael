//Imports
const models = require('../models');
const jwtUtils = require('../utils/jwt.utils');
const fs = require('fs');



//Constantes
const CONTENT_REGEX = /^([a-z]|[A-Z]|[0-9,;.]){4,8}$/;
const ITEMS_LIMIT = 50;

//Routes

//Création d'un Post
exports.createMessage = (req, res, next) => {
    //identification de l'utilisateur
    const userId = jwtUtils.getUserId(req.headers.authorization);

    //Params
    const title = req.body.title;
    const content = req.body.content;

    if (title == null || content == null) {
        return res.status(400).json({ 'error': 'Champ manquant' });
    }
    if (title.length <= 2 || content.length <= 4) {
        return res.status(400).json({ 'error': 'Le titre et le contenu doivent contenir respectivement 2 et 4 caractères au minimum' });
    }
    if (CONTENT_REGEX.test(content)) {
        return res.status(400).json({ 'error': 'Pas de caractères spéciaux' });
    }

    models.User.findOne({
        where: { id: userId }
    })
        .then(function (userFound) {
            if (userFound) {
                models.Message.create({
                    title: title,
                    content: content,
                    likes: 0,
                    dislikes: 0,
                    UserId: userFound.id
                })
                    .then(function (newMessage) {
                        if (newMessage) {
                            return res.status(201).json(newMessage);
                        } else {
                            return res.status(500).json({ 'error': 'impossible de poster' });
                        }
                    })

            } else {
                res.status(404).json({ 'error': 'utilisateur introuvable' });
            }

        })
        .catch(function (err) {
            return res.status(500).json({ 'error': 'vérification impossible' });
        })
}

//Lister les posts
exports.listMessages = (req, res, next) => {
    const fields = req.query.fields;
    const limit = parseInt(req.query.limit);
    const offset = parseInt(req.query.offset);
    const order = req.query.order;

    if (limit > ITEMS_LIMIT) {
        limit = ITEMS_LIMIT;
    }

    models.Message.findAll({
        order: [(order != null) ? order.split(':') : ['title', 'ASC']],
        attributes: (fields !== '*' && fields != null) ? fields.split(',') : null,
        limit: (!isNaN(limit)) ? limit : null,
        offset: (!isNaN(offset)) ? offset : null,
        include: [{
            model: models.User,
            attributes: ['username']
        }]
    }).then(messages => {
        if (messages) {
            res.status(200).json(messages);
        } else {
            res.status(404).json({ 'error': 'pas de publication trouvée' });
        }

    }).catch(err => res.status(500).json({ err }));
    
}

//Supprimer un post
exports.delete = (req, res, next) => {
    const userIdent = jwtUtils.getUserId(req.headers.authorization);
    const messageId = parseInt(req.params.messageId);
    console.log(req.headers.authorization);
    console.log(messageId);
    models.Message.findOne({
        where: { UserId: userIdent }
    })
        .then(identifiant => {
            models.User.findOne({
                attributes: ['id', 'email', 'username', 'isAdmin'],
                where: { Id: userIdent }
            })
                .then(user => {
                    if (user && (user.isAdmin == true || user.id == identifiant.UserId)) {
                        models.Message.findOne({
                            where: { id: messageId }
                        })
                            .then(MessageFound => {
                                if (MessageFound.attachement) {
                                    const filename = MessageFound.attachement.split('/images/')[1];
                                    fs.unlink(`images/${filename}`, () => {
                                        models.Message.destroy({ where: { id: MessageFound.id } })
                                            .then(() => res.status(200).json({ 'message': 'fin' }))
                                            .catch(err => res.status(500).json({ err }))
                                    })
                                } else {
                                    models.Message.destroy({ where: { id: MessageFound.id } })
                                        .then(() => res.status(200).json({ 'message': 'fin' }))
                                        .catch(err => res.status(500).json({ 'erreur': err }))
                                }
                            })
                            .catch(err => res.status(500).json(err))
                    } else {
                        res.status(400).json('utilisateur non autorisé à supprimer ce post ' + userIdent + ' ' + identifiant.UserId);
                    }
                })
                .catch(err => res.status(500).json(err))
        })
        .catch(err => res.status(500).json({ 'error': 'impossible' + err }));
    if (messageId <= 0) {
        return res.status(400).json({ 'error': 'paramètres invalides' })
    }

}