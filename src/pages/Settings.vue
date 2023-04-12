<script setup>
import Tabs from "../components/Tabs/index.vue";
import PersonalInformation from "../components/Forms/SettingsPersonal.vue";
import PasswordForm from "../components/Forms/SettingsPassword.vue";

const tabList = ["Profile", "Password"];
</script>
<template>
  <div class="w-full mt-8">
    <!-- <div
    class="w-full h-[100px]"
    >
        <img class="w-full h-full object-cover" src="src/assets/img/stacked-steps.svg" alt="settings">
    </div> -->
    <h2 class="px-6 sm:px-10 text-primary text-2xl font-semibold">Settings</h2>
    <div class="w-full my-10">
      <Tabs :tabList="tabList" customClass="text-light flex justify-between xs:justify-start xs:grid xs:grid-cols-2 overflow-auto xs:overflow-visible">
        <template v-slot:tabPanel-1>
          <PersonalInformation />
        </template>
        <template v-slot:tabPanel-2>
          <PasswordForm />
        </template>
      </Tabs>
    </div>
  </div>
</template>
