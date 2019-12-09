<template>
  <v-container>
  <template>
  <v-data-table
    :headers="headers"
    :items="requestNotes"
    class="elevation-1">

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
            <v-btn color="primary" dark class="mb-2" v-on="on">New Note</v-btn>
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
              <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
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
        @click="confirmDelete(item)"
      >
        delete
      </v-icon>
    </template>
  </v-data-table>

  <v-row justify="center">
    <v-dialog v-model="dialogConfirm" persistent max-width="290">
      <v-card>
        <v-card-title class="headline">Are you sure you want to delete?</v-card-title>
        <v-card-text></v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="dialogConfirm = false">Disagree</v-btn>
          <v-btn color="green darken-1" text @click="deleteItem">Agree</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>

</template>

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
    headers: [
      { text: 'Description', value: 'description' },
      { text: 'Actions', value: 'action', sortable: false }
    ],
    editedIndex: -1,
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

  editItem (item) {
    let note = this.notes.find(note => {
      return note.id === item.id
    })
    this.editedIndex = this.notes.indexOf(note)
    this.editedItem = Object.assign({}, note)
    this.dialog = true
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

  save () {
    if (this.editedIndex > -1) {
      this.$store.dispatch('UPDATE_NOTE', { note: this.editedItem, index: this.editedIndex })
        .then(note => {
          this.editedNote.description = note.description
      })
    } else {
      this.editedNote.description = this.editedItem.description
      this.$store.dispatch('SAVE_NOTE', { note: this.editedNote })
      this.close()
    }
    this.close()
  },
  },
  watch: {
    dialog (val) {
      val || this.close()
    },
  },
};
</script>
