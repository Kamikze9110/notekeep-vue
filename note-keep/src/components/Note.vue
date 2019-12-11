<template>
  <v-container>
    <v-row>
      <v-col cols="8" sm="6" md="8">
    
  <template>
  <v-data-table
    :headers="headers"
    :items="requestNotes"
    class="elevation-1" 
    >

    <template v-slot:top>
      <v-toolbar flat color="white">
        <v-toolbar-title>List Notes</v-toolbar-title>
        <v-divider
          class="mx-4"
          inset
          vertical
        ></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on }">
            <v-btn color="primary" dark class="mb-2" v-on="on" @click="prepareNew">New Note</v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="12">
                    <v-text-field v-model="editedItem.description" label="Note" required></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="cancel">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="save">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

      </v-toolbar>
    </template>
    <template v-slot:item.action="{ item }">
      <v-icon
        small
        class="mr-2"
        @click="editItem(item)"
      >
        edit
      </v-icon>
      <v-icon
        small
        class="mr-2"
        @click="viewTasks(item)"
      >
        show
      </v-icon> 
      <v-icon
        small
        @click="confirmDelete(item)"
      >
        delete
      </v-icon>
    </template>
  </v-data-table>

  <v-row justify="center">
    <v-dialog v-model="dialogConfirm" persistent max-width="290">
      <v-card>
        <v-card-title class="headline">Alert</v-card-title>
        <v-card-text>Are you sure you want to delete?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="dialogConfirm = false">NO</v-btn>
          <v-btn color="green darken-1" text @click="deleteItem">YES</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>


  <v-row justify="center">
    <v-dialog v-model="dialogError" persistent max-width="290">
      <v-card>
        <v-card-title class="headline">Error</v-card-title>
        <v-card-text>{{ errorMsg }}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="dialogError = false">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>

</template>
</v-col>

<v-col cols="4" sm="6" md="4" v-if="editedIndex >= 0">
  <v-card
    max-width="475"
    class="mx-auto"
  >
    <v-toolbar
      color="teal"
      dark
    >
      
      <v-toolbar-title>Task</v-toolbar-title>
    </v-toolbar>

    <v-list two-line subheader>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>
            <v-text-field v-model="editedTask.description" label="Task Name" required></v-text-field>
          </v-list-item-title>
          <v-list-item-subtitle>
            <div class="my-2">
              <v-btn small color="primary" text @click="saveTask">Save</v-btn>
            </div>
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <v-divider></v-divider>

    <v-list
      subheader
      two-line
      flat
    >
      <v-subheader>Tasks</v-subheader>

      <v-list-item-group
        v-model="editedNote.tasks"
        multiple
      >

        <v-list-item v-for="task in editedItem.tasks" :key="task.id">
          <template v-slot:default="{ active, toggle }">
            <v-list-item-action>
              <v-checkbox
                v-model="task.complete"
                color="primary"
                @click="updateTaskToggle(task , active)"
              ></v-checkbox>
            </v-list-item-action>

            <v-list-item-content>
              <v-list-item-title>{{ task.description }}</v-list-item-title>
              <v-icon
                small
                class="mr-2"
                @click="deleteTask(task)"
              >
              delete
              </v-icon>
            </v-list-item-content>
          </template>
        </v-list-item>

      </v-list-item-group>
    </v-list>
  </v-card>


</v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Note',
  created () {
    this.initialize()
  },
  data: () => ({
   title: "Note",
   dialog: false,
   dialogConfirm: false,
   dialogChecklist: false,
   dialogError: false,
   errorMsg: '',
   temporalTasks: [],
    editedNote: {
      id: null,
      description: '',
      tasks: []
    },
    defaultNote: {
      id: null,
      description: '',
      tasks: []
    },
    editedTask: {
      id: null,
      description: '',
      complete: false
    },
    defaultTask: {
      id: null,
      description: '',
      complete: false
    },
    temporalTask: {
      id: null,
      description: '',
      complete: false
    },
    headers: [
      { text: 'Description', value: 'description' },
      { text: 'Actions', value: 'action', sortable: false }
    ],
    editedIndex: -1,
    editedTaskIndex: -1,
    editedItem: {
      id: null,
      description: '',
      tasks: []
    },
    defaultItem: {
      id: null,
      description: '',
      tasks: []
    }, 
  }),
  computed: {
    ...mapGetters({
      notes: 'getNotes',
    }),
    formTitle () {
      return this.editedIndex === -1 ? 'New Note' : 'Update Note'
    },
    formChecklistTitle () {
      return this.editedIndex === -1 ? 'New Checklist' : 'Update Checklist'
    },
    requestNotes () {
      return this.notes.map(note => {
        return {
          id: note.id,
          description: note.description,
          tasks: note.tasks
        }
      })
    },
  },
  methods: {
  initialize () {
    this.$store.dispatch('FETCH_NOTE')
  },
  viewTasks (item) {
     let note = this.notes.find(note => {
      return note.id === item.id
    })
    this.editedIndex = this.notes.indexOf(note)
    this.editedItem = Object.assign({}, note)
  },
  editItem (item) {
    let note = this.notes.find(note => {
      return note.id === item.id
    })
    this.editedIndex = this.notes.indexOf(note)
    this.editedItem = Object.assign({}, note)
    this.dialog = true
  },
  prepareNew () {
    this.editedIndex = -1
    this.editedItem = Object.assign({}, this.defaultItem)
  },
  addTaskItem () {
    this.temporalTask.description = this.editedTask.description
    this.temporalTask.complete = true
    this.temporalTasks.push(this.temporalTask)
  },  

  confirmDelete (item) {
    let note = this.notes.find(note => {
      return note.id === item.id
    })
    this.editedIndex = this.notes.indexOf(note)
    this.editedItem = Object.assign({}, note)
    this.dialogConfirm = true
  },

  deleteItem(){
    this.$store.dispatch('DELETE_NOTE', { note: this.editedItem, index: this.editedIndex  })
    this.editedIndex = -1
    this.editedItem.description = ''
    this.dialogConfirm = false
  },

  close () {
    this.dialog = false
    setTimeout(() => {
      this.editedItem = Object.assign({}, this.defaultItem)
      this.editedIndex = -1
    }, 300)
  },

  cancel () {
    this.dialog = false
  },

  save () {
    if (this.editedIndex > -1) {
      this.$store.dispatch('UPDATE_NOTE', { note: this.editedItem, index: this.editedIndex })
        .then(note => {
          this.editedNote.description = note.description
      })
    } else {
      if(this.editedItem.description == ''){
        this.errorMsg = 'The field can´t be empty'
        this.dialogError = true
      }else{
        this.editedNote.description = this.editedItem.description
        this.$store.dispatch('SAVE_NOTE', { note: this.editedNote })
      }
    }
    this.close()
  },
  reInitTask () {
    this.temporalTasks = []
    this.temporalTask.description = ''
    this.temporalTask.complete = false
  },
  saveTask () {
      if(this.editedTask.description == ''){
        this.errorMsg = 'The field can´t be empty'
        this.dialogError = true
      }else{
        this.$store.dispatch('SAVE_TASK', { note: this.editedItem, task: this.editedTask })
        this.editedTask = {}
      }
  },
  updateTaskToggle (task , toggle) {
    task.complete = toggle
    this.$store.dispatch('UPDATE_TASK' , {note: this.editedItem, task: task})
  },
  deleteTask (task){
    this.$store.dispatch('DELETE_TASK' , {note: this.editedItem, task: task})
  }
  },
  watch: {
    dialog (val) {
      val || this.close()
    },
  },
};
</script>
