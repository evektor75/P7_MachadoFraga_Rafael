//Imports
const models = require('../models');
const jwtUtils = require('../utils/jwt.utils');
const fs = require('fs');



//Constantes
const CONTENT_REGEX = /^[a-zA-Z0-9 ]*$/;
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
/*exports.listMessages = (req, res, next) => {
    models.Message.findAll({
        include: ['Comments'],
        order: [['createdAt', 'DESC']]
    }).then(messages => {
        if (messages) {
            res.status(200).json(messages);
        } else {
            res.status(404).json({ 'error': 'pas de publication trouvée' });
        }

    }).catch(err => res.status(500).json({ err }));

}*/

exports.listMessages = (req, res, next) => {
    models.Message.findAll({include: [{
        model: models.User
    },
        {
            model: models.Comment, 
            include: {
                model: models.User
            }
            
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


//TODO Modification d'un post



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