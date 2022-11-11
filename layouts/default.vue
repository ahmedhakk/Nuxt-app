<template>
  <div>
    <TheHeader @sidenavToggle="toggleSidenav" />
    <TheSidenav :show="displaySidenav" @close="closeSidenav" />
    <nuxt></nuxt>
  </div>
</template>

<script>
import TheHeader from "@/components/Navigation/TheHeader.vue";
import TheSidenav from "@/components/Navigation/TheSidenav.vue";

export default {
  // middleware: "log",
  components: {
    TheHeader,
    TheSidenav,
  },
  data() {
    return {
      displaySidenav: false,
    };
  },
  methods: {
    toggleSidenav() {
      this.displaySidenav = !this.displaySidenav;
    },
    closeSidenav() {
      this.displaySidenav = false;
    },
  },
};
</script>

<style>
html {
  font-family: "Poppins", sans-serif;
  font-family: "Roboto", sans-serif;
}
body {
  margin: 0;
}
</style>