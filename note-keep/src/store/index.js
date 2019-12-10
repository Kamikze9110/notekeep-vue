import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

const restUrl = 'http://localhost:8080/'
const noteServiceUrl = 'note'
const taskServiceUrl = 'task'

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
    SAVE_TASK: ({commit } , {note , task }) => {
      return axios.post(`${restUrl}/${noteServiceUrl}/${note.id}/${taskServiceUrl}` , task)
      .then(response => {
        commit('ADD_TASK', { task: response.data, noteId: note.id })
        return response.data
      }).catch(error => {
        // eslint-disable-next-line
        console.error(error);
      })
    }, 
    UPDATE_TASK: ({ commit } , {note , task}) => {
      return axios.put(`${restUrl}/${noteServiceUrl}/${note.id}/${taskServiceUrl}/${task.id}` , task)
      .then(response => {
        commit('UPDATE_TASK', { task: response.data, noteId: note.id })
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
    },
    DELETE_TASK: ({ commit }, {note , task}) => {
      return axios.delete(`${restUrl}/${noteServiceUrl}/${taskServiceUrl}/${task.id}`)
      .then(response => {
        commit('DELETE_TASK', { noteId: note.id, taskId: task.id })
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
    },
    UPDATE_TASK: (state , {taskId, noteId}) => {
      let indexNote = state.notes.findIndex( note => note.id === noteId )
      let indexTask = state.notes[indexNote].tasks.findIndex( task => task.id === taskId )
      let task = Object.assign({}, state.notes[indexNote].tasks[indexTask])
      state.notes[indexNote].tasks[indexTask] = Object.assign({}, task)
    },
    ADD_TASK: (state , {task, noteId}) => {
      let indexNote = state.notes.findIndex( note => note.id === noteId )
      let note = Object.assign({}, state.notes[indexNote])
      note.tasks.push(task)
      //state.notes[indexNote].splice(indexNote , 1)
      //state.notes[indexNote] = note
      state.notes[indexNote] = Object.assign({}, note)
    },
    DELETE_TASK: (state , {noteId, taskId}) => {
      let indexNote = state.notes.findIndex( note => note.id === noteId )
      let indexTask = state.notes[indexNote].tasks.findIndex( task => task.id === taskId )
      state.notes[indexNote].tasks.splice(indexTask, 1);
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
