<template>
  <div class="q-pa-md flex flex-center" style="height: 100vh">
    <q-card style="width: 400px; max-width: 80vw">
      <q-card-section class="q-pb-xs">
        <div class="text-h4 text-bold text-center">Log in</div>
      </q-card-section>
      <q-card-section class="q-pb-xs">
        <div class="text-italic text-weight-light text-center">
          You are just one step
        </div>
      </q-card-section>
      <q-card-section class="q-pt-xs">
        <q-form @submit="singIn" ref="login">
          <q-input
            class="full-width"
            type="email"
            label="Email"
            v-model="email"
          >
          </q-input>
          <q-input
            class="full-width cursor-pointer"
            label="Password"
            :type="isPwd ? 'password' : 'text'"
            @click="isPwd = !isPwd"
            :rules="[(val) => !!val || 'Password is required']"
            v-model="password"
          >
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>
          <q-btn
            class="full-width q-mt-lg"
            glossy
            icon="arrow_circle_right"
            color="primary"
            type="submit"
            label="next"
          ></q-btn>
        </q-form>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { signInWithEmailAndPassword } from "@firebase/auth";
import { collection, getDocs, query, where } from "@firebase/firestore";
import { auth, db } from "src/firebase";
import { ref } from "vue";
import { useRouter } from "vue-router";

const $router = useRouter();

const email = ref(null);
const password = ref(null);
const isPwd = ref("false");
const errorMessageLogin = ref({
  "auth/wrong-password": "Wrong password",
  "auth/user-not-found": "User not found",
  "auth/user-disabled": "User disabled",
  "auth/too-many-requests":
    "temporarily disabled due to many failed login attempts",
});

const setUser = async (email) => {
  try {
    const docUserRef = collection(db, "users");
    const q = query(docUserRef, where("email", "==", email));
    const docSnap = await getDocs(q);
    const user = docSnap.docs.map((doc) => doc.data());
    console.log(user);
    localStorage.setItem("user", JSON.stringify(user[0]));
  } catch (error) {
    console.log(error);
  }
};

/**
 *  funtion to login user
 */
const singIn = () => {
  signInWithEmailAndPassword(auth, email.value, password.value)
    .then((userCredential) => {
      const user = userCredential.user;
      localStorage.setItem("email", user.email);
      localStorage.setItem("accessToken", user.accessToken);
      setUser(user.email);
      $router.push({ name: "Home" });
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
      console.log(errorMessageLogin.value[errorCode]);
    });
};
</script>

<style lang="sass" scoped></style>
