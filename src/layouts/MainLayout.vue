<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title> Base Project </q-toolbar-title>

        <div>
          <q-btn flat round icon="logout" size="md" @click="logOut">
            <q-tooltip transition-show="rotate" transition-hide="rotate">
              Logout
            </q-tooltip>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> Essential Links </q-item-label>

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from "vue";
import EssentialLink from "components/EssentialLink.vue";
import { signOut } from "@firebase/auth";
import { auth } from "src/firebase";
import { useRouter } from "vue-router";

const linksList = [
  {
    title: "Users",
    icon: "group",
    link: "User",
  },
];

export default defineComponent({
  name: "MainLayout",

  components: {
    EssentialLink,
  },

  setup() {
    const leftDrawerOpen = ref(false);
    const $router = useRouter();

    return {
      essentialLinks: linksList,
      leftDrawerOpen,
      logOut() {
        console.log("Logging out");
        signOut(auth)
          .then(() => {
            localStorage.clear();
            $router.push("/login");
          })
          .catch((error) => {
            console.error(error);
          });
      },
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },
});
</script>
