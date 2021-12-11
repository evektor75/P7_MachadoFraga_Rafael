<template>
<div class="card mb-4 w-75 mx-auto post">
  <div class="card-header d-flex justify-content-between">
    <div class="card-header_name">De <span class="authorPost"> {{message.User.username}} </span> le <span class="dayPost"> { {message.createdAt.split(' ')[0]} }</span> à <span class="timePost"> { {message.createdAt.split(' ')[1]} } </span></div>
    <div class="card-header_dot" v-if="user.isAdmin == true || user.username == message.User.username"><router-link to="/feed/modifypost"><font-awesome-icon :icon="['fas','bars']"/></router-link></div>
    
  </div>
  <div class="card-body">
    <h5 class="card-title" v-if="message.title">{ {message.title} }</h5>
    <p class="card-text" v-if="message.content !== 'null'"> { {message.content} }</p>
    <div class="card-img mx-auto" v-if="message.attachement">
        <img :src="message.attachement" alt="..." class="urlAttachment"/>
    </div>
  </div>
  <div class="card-footer">
        <div class="d-flex justify-content-between align-items-center content">
            <div class="mr-3 content_like"><font-awesome-icon :icon="['fas','thumbs-up']" class="mr-1"/>Like</div>
            <div class="mr-3 content_comment"><font-awesome-icon :icon="['fas','comment']" class="mr-1"/>Commenter</div>
        </div>
        <div class="content_border"></div>
        <div class="comment d-flex ">
            <div class="mt-2 mr-2 comment_name">Nom</div>
            <div class="mt-2 ml-2 comment_commentary">Commentaire</div>
        </div>
  </div>
</div>

</template>

<script>
import { mapState } from "vuex";

export default {
    name :"post",
    data() {
        return {
            message: {
                title: null,
                content: null,
                attachement:null
            }
        };
    },
    computed: {
        ...mapState(["user", "editOption"])
    },
    methods: {
        emitInformationPost() {
            this.$emit("infosMessage", { message: this.message });
        },
        changeEditStyle(value) {
            this.$store.dispatch("changeEditStyle", value);
        }
    }
}

</script>

<style lang="scss">
.post{
    margin-top:15px;
}
.content{
    margin-top:auto;
    margin-bottom: 10px;
    &_like{
        width:50%;
        text-align:center;
    }
    &_comment{
        width:50%;
        text-align:center;
    }

}
.content_border{
    border-bottom:1px solid rgba(0,0,0,.125);
    padding:0!important;
  
}
</style>