<template>
  <q-page padding>
    <!-- content -->
    <div class="q-pa-md row q-col-gutter-sm">
      <div class="col-6 text-h4 text-bold text-primary">User Management</div>
      <div class="col-6 text-right">
        <q-btn
          color="primary"
          outline
          rounded
          icon="person_add"
          label="ADD USER"
          @click="openPrompt"
        />
      </div>
      <div class="q-pa-md full-width row q-col-gutter-md">
        <div
          class="col-xl-3 col-lg-3 col-md-4 col-sm-4 col-xs-6"
          v-for="user in users"
          :key="user.document_number"
        >
          <q-card class="full-width">
            <q-item>
              <q-item-section top avatar>
                <q-avatar>
                  <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
                </q-avatar>
              </q-item-section>

              <q-item-section>
                <q-item-label
                  >{{ user.name }} {{ user.last_name }}</q-item-label
                >
                <q-item-label caption>{{ user.profession }}</q-item-label>
                <q-item-label caption>{{ user.email }}</q-item-label>
                <q-item-label caption>{{ user.phone_numer }}</q-item-label>
              </q-item-section>

              <q-item-section side top>
                <q-btn icon="more_vert" size="xs" flat round>
                  <q-menu
                    transition-show="flip-left"
                    transition-hide="flip-right"
                  >
                    <div class="row no-wrap q-pa-xs">
                      <div class="column">
                        <q-btn
                          flat
                          round
                          class="q-pa-xs"
                          size="xs"
                          @click="editUser(user)"
                        >
                          <q-icon name="visibility" color="secondary" size="xs">
                            <q-tooltip
                              transition-show="flip-right"
                              transition-hide="flip-left"
                            >
                              Edit
                            </q-tooltip></q-icon
                          >
                        </q-btn>
                      </div>
                    </div>
                    <div class="row no-wrap q-pa-xs">
                      <div class="column">
                        <q-btn
                          flat
                          round
                          class="q-pa-xs"
                          size="xs"
                          @click="deleteUser(user)"
                        >
                          <q-icon name="delete" color="negative" size="xs">
                            <q-tooltip
                              transition-show="flip-right"
                              transition-hide="flip-left"
                            >
                              Delete
                            </q-tooltip>
                          </q-icon>
                        </q-btn>
                      </div>
                    </div>
                  </q-menu>
                </q-btn>
              </q-item-section>
            </q-item>
          </q-card>
        </div>
      </div>
    </div>

    <!--PROMPT-->
    <q-dialog v-model="prompt" persistent>
      <q-card style="min-width: 450px">
        <q-form @submit="userCollections">
          <q-card-section>
            <div class="text-h6 text-bold text-primary">Register User</div>
          </q-card-section>
          <q-card-section class="row q-col-gutter-md">
            <div class="col-6">
              <q-input dense autofocus label="Nombre" v-model="user.name" />
            </div>
            <div class="col-6">
              <q-input
                dense
                autofocus
                label="Apellido"
                v-model="user.last_name"
              />
            </div>
            <div class="col-6">
              <q-input
                dense
                autofocus
                label="C.I"
                v-model="user.document_number"
              />
            </div>
            <div class="col-6">
              <q-input
                dense
                autofocus
                label="Profesion"
                v-model="user.profession"
              />
            </div>
            <div class="col-6">
              <q-input
                dense
                autofocus
                type="email"
                label="Email"
                v-model="user.email"
              />
            </div>
            <div class="col-6">
              <q-input
                dense
                autofocus
                label="Telefono"
                v-model="user.phone_numer"
              />
            </div>
            <div class="col-6">
              <q-input
                dense
                :type="isPwd ? 'password' : 'text'"
                autofocus
                label="Contrasena"
                v-model="user.password"
              >
              </q-input>
            </div>
            <div class="col-6">
              <q-input
                dense
                :type="isPwd ? 'password' : 'text'"
                autofocus
                label="Corfirmar contrasena"
                v-model="user.password_verified"
              >
                <template v-slot:append>
                  <q-icon
                    :name="isPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isPwd = !isPwd"
                  />
                </template>
              </q-input>
            </div>
          </q-card-section>
          <q-card-actions align="right" class="text-primary">
            <q-btn label="CANCELAR" color="negative" v-close-popup></q-btn>
            <q-btn label="AGREGAR" color="primary" type="submit"></q-btn>
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { createUserWithEmailAndPassword } from "@firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
} from "@firebase/firestore";
import { auth, db } from "src/firebase";
import { ref, onBeforeMount } from "vue";
import { useQuasar } from "quasar";

const $q = useQuasar();
/**
 *
 */
const prompt = ref(false);
/**
 *
 */
const isPwd = ref(true);

/**
 * Object to store user data
 */
const user = ref({});

/**
 *list of users
 */
const users = ref([]);

/**
 * User session
 */
const userSession = ref(JSON.parse(localStorage.getItem("user")));

/**
 * loading
 */
const loading = ref(false);

/**
 *
 */
const edit = ref(null);

const loadingDelete = ref(false);

onBeforeMount(() => {
  getUserCollections();
});

/**
 * @param {} none
 * @return {} none
 *  open prompt dialog to register a new user
 */
const openPrompt = () => {
  prompt.value = true;
  user.value = {
    created_at: new Date(),
    user_created_at: userSession.value,
  };
};

/**
 * save user credentials
 *
 * @param {*} email
 * @param {*} password
 */
const saveCredenciales = (email, password) => {
  if (email && password) {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredentials) => {
        console.log(userCredentials);
      })
      .catch((error) => {
        console.log(error);
        loading.value = false;
      });
  }
};

/**
 * save user data in the database collection users
 */
const userCollections = async () => {
  try {
    loading.value = true;
    user.value.email = user.value.email.toLowerCase();
    await setDoc(doc(db, "users", user.value.document_number), user.value);
    if (!edit.value) {
      saveCredenciales(user.value.email, user.value.password);
    }
    user.value = {};
    edit.value = false;
    prompt.value = false;
    getUserCollections();
    loading.value = false;
  } catch (error) {
    console.log(error);
    loading.value = false;
  }
};

/**
 * Get all from collection users
 */
const getUserCollections = async () => {
  try {
    loading.value = true;
    const docRef = collection(db, "users");
    const docSnap = await getDocs(docRef);
    users.value = docSnap.docs.map((doc) => doc.data());
    loading.value = false;
  } catch (error) {
    console.log(error);
    loading.value = false;
  }
};

/**
 * edit user in the database collection users
 * @param {*} row
 */
const editUser = async (data) => {
  user.value = data;
  user.value.updated_at = new Date();
  user.value.user_updated_at = userSession.value.name;
  edit.value = true;
  prompt.value = true;
};

/**
 * delete user in the database collection users
 * @param {*} data
 */
const deleteUser = async (data) => {
  $q.dialog({
    title: "Alert?",
    message: "Are you sure you want to delete",
    cancel: {
      label: "Cancel",
      color: "secondary",
    },
    ok: {
      label: "Delete",
      color: "negative",
      loading: loadingDelete.value,
    },
    persistent: true,
  }).onOk(async () => {
    await deleteUser(user)
      .then(() => {
        loadingDelete.value = true;
        deleteDoc(doc(db, "users", data.document_number));
        loadingDelete.value = false;
        $q.notify({
          message: "Succesfully User deleted",
          color: "positive",
        });
        getUserCollections();
      })
      .catch((error) => {
        console.log(error);
      });
  });
};
</script>
