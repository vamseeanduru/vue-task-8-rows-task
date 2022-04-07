<template>
  <div class="container-fluid">
    <h1>Plants Data</h1>
  
    <br />
    <router-link to="/"><button class="btn btn-success">Home</button></router-link>
    <br />

    <rows :blockList="myJson2"></rows>
    <!-- <edit-rows :data="myJson2"></edit-rows> -->
  </div>
</template>

<script>
import lotRows from "../../lotRows.json";
import lotRows2 from "../../lotRows-2.json";
import Rows from '../../components/Rows.vue';
// import EditRows from '../../components/EditRows.vue';



export default {
  components: {
    Rows
    // EditRows
  },
  name: "GetPlanets",
  data() {
    return {
      myJson: lotRows,
      myJson2: lotRows2,
      show: true,
      selected: null,
    };
  },
  created() {},
  methods: {
    showData(data) {
      this.show = true;
      this.planetsData.push(data);
    },
  },
  computed: {
    planetsData() {
      return this.$store.state.planetsData;
    },
  },
  mounted() {
    this.$store.dispatch("getPlanetsData");
  },
};
</script>

<style>
.btn-success {
  margin-right: 95%;
  margin-bottom: 20px;
}

.btn-outline-danger {
  margin-right: 96%;
  margin-bottom: 20px;
}
</style>
