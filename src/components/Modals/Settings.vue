<template>

  <div class="container">

    <div class="setting">
      <div class="setting-name">Use Test Data</div>
      <toggle-switch class="option" :checked="useTestData" :toggle="'toggleUseTestData'"/>
    </div>

    <div class="setting">
      <div class="setting-name">Notifications</div>
      <toggle-switch class="option" :checked="showNotifications" :toggle="'toggleNotifications'"/>
    </div>

    <div class="setting">
      <div class="setting-name">Refresh Rate (Minutes)</div>

      <input type="text" class="option text-input" maxlength="2" 
        v-model="refreshRate" 
        @input="changeRefreshRate"
      />
    </div>

    <div class="setting">
      <div class="setting-name">Supply Threshold</div>

      <input type="text" class="option text-input" maxlength="4" 
        v-model="supplyThreshold" 
      />
    </div>

    

  </div>

</template>

<style scoped>

  .container {
    background: white;
    padding: 30px 10%;
  }

  .setting {
    display: block;
    padding: 20px 0px;
    border-bottom: 0.5px solid rgba(0,0,0, 0.1);
  }

  .text-input {
    outline: none;
    font-family: 'Open Sans', sans-serif;
    font-weight: 700;
    font-size: 16px;
    font-style: italic;

    text-align: center;
    padding: 2px 10px;
    width: 70px;
  }

  .setting-name {
    display: inline;
    text-align: left;
    font-family: 'Open Sans', sans-serif;
    font-weight: 400;
    font-size: 18px;
    
  }

  .option {
    display: block;
    float: right;
    margin: auto;
  }
</style>

<script>

import ToggleSwitch from '@/components/Interactables/ToggleSwitch.vue'
import cookies from 'vue-cookies'

export default {
  components: {
    ToggleSwitch
  },
  computed: {
    useTestData(){return this.$store.state.settings.useTestData},
    showNotifications(){return this.$store.state.settings.showNotifications},
    refreshRate: {
      get(){return this.$store.state.settings.refreshRate},
      set(refreshRate){
        this.$store.commit('setRefreshRate', refreshRate)
        this.$store.dispatch('resetCounter')
      }
    },
    supplyThreshold:{
      get(){return this.$store.state.settings.supplyThreshold},
      set(supplyThreshold){
        this.$store.commit('setSupplyThreshold', supplyThreshold)
      }
    }
  },
  methods: {
    changeRefreshRate(){
    },
    changeSupplyThreshold(){
      cookies.set('supplyThreshold', this.supplyThreshold, -1)
    }
  },
}

</script>
