import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

const restUrl = 'http://localhost:8080/'
const noteServiceUrl = 'note'

export default new Vuex.Store({
  state: {
    notes: []
  },
  actions: {
    FETCH_NOTE:  ({ commit }) => {
      axios.get(`${restUrl}/${noteServiceUrl}`)
      .then(response => {
        commit('SET_NOTES', { notes: response.data })
        return response.data
      })
      .catch(error => {
        // eslint-disable-next-line
        console.error(error);
      })
    },
    SAVE_NOTE:  ({ commit }, { note }) => {
      return axios.post(`${restUrl}/${noteServiceUrl}`, note)
        .then(response => {
          commit('ADD_NOTE', { note: response.data })
          return response.data
        })
        .catch(error => {
          // eslint-disable-next-line
          console.error(error);
        })
    },
    UPDATE_NOTE:  ({ commit }, { note , index }) => {
      return axios.put(`${restUrl}/${noteServiceUrl}/${note.id}` , note)
      .then(response => {
        commit('CHANGE_NOTE', { note: response.data, index: index })
        return response.data
      }).catch(error => {
        // eslint-disable-next-line
        console.error(error);
      })
    },
    DELETE_NOTE: ({ commit }, {note , index}) => {
      return axios.delete(`${restUrl}/${noteServiceUrl}/${note.id}`)
      .then(response => {
        commit('REMOVE_NOTE', { index: index })
        return response.data
      }).catch(error => {
        // eslint-disable-next-line
        console.error(error);
      })
    }
  },
  mutations: {
    SET_NOTES: (state, { notes }) => {
      state.notes = notes
    },
    ADD_NOTE: (state, { note }) => {
      state.notes.push(note)
    },
    CHANGE_NOTE: (state, {note , index}) => {
      Object.assign(state.notes[index], note)
    },
    REMOVE_NOTE: (state, {index}) => {
      state.notes.splice(index, 1);
    }
  },
  getters:{
    getNotes: state => {
      return state.notes
    },
  },
  modules: {
  },
})
