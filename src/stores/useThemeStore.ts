import { defineStore } from "pinia";
import { ref } from "vue";

/* export const useThemeStore = defineStore("theme", {
  state: () => ({
    theme: "dark-theme"
  }),
  actions: {
    setTheme(t: "light-theme" | "dark-theme") {
      this.theme = t;
      document.body.className = t;
    }
  }
}); */

export const useThemeStore = defineStore("theme", () => {
  const theme = ref("light-theme");

  const setTheme = (t: "light-theme" | "dark-theme") => {
    theme.value = t;
    document.body.className = t;
  };

  return { theme, setTheme };
});
