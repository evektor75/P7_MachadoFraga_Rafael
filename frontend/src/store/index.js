import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {
      email: '',
      username: '',
      bio: '',
      userId: '',
      token: null,
      isAdmin: false

    }
  },
  mutations: {
    userInformations(state, [email, username, bio, userId, isAdmin]) {
      state.user.email = email,
        state.user.username = username,
        state.user.bio = bio,
        state.user.userId = userId,
        state.user.token = localStorage.getItem('token'),
        state.user.isAdmin = isAdmin
    }
  },
  actions: {
    getUserProfile(content) {
      axios.get("http://localhost:3000/api/auth/compte/me", {
        headers: {
          authorization: "Bearer" + localStorage.getItem('token')
        }
      })
        .then( res => {content.commit('userInformations', [res.data.username, res.data.id, res.data.email, res.data.bio, res.data.isAdmin])})
        .catch(err => console.log('erreur requête API' + err))
    }
  },
  modules: {
  }
})
