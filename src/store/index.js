import { defineStore } from "pinia";
import { ref } from "vue";

export const useAppStore = defineStore(
  "app",
  () => {
    const isMobile = ref(false);
    const isAuth = ref(false);
    const user = ref({});
 function updateUser(currentUser){
  user.value.firstname = currentUser.firstname
  user.value.lastname =  currentUser.lastname
  user.value.email = currentUser.email
  user.value.id = currentUser.uniqueId
}
function toggleMobile (){
  isMobile.value = !isMobile.value
}
    return {
      isMobile,
      isAuth,
      user,
      updateUser,
      toggleMobile
    };
  },
  {
    persist: {
      key: "finwiseState",
    },
  }
);
