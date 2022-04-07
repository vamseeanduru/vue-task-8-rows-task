<template>
<div class="container-fluid">
  <table v-if="externalTableData.length > 0" class="table table-bordered table-hover table-responsive">
    <thead class="table-dark">
      <tr>
        <th v-for="(item, name, idx) in externalTableData.Row_data" :key="idx">
          {{ name }}
        </th>
      </tr>
    </thead>
    <tbody class="table-primary">
      <tr v-for="(item) in externalTableData" :key="item.name" @click="clicked(item)">
        <td v-for="(data, name, rowIdx) in item.Row_data" :key="rowIdx"  >
          {{ data }}
        </td>
      </tr>
    </tbody>
  </table>
  <div>
    <base-rows :planetData="planetData"></base-rows>
  </div>
</div>
</template>

<script>
import BaseRows from './BaseRows.vue';
export default {
  components: { BaseRows },
  name: "TableView",
  props: {
    externalTableData: {
      type: Array,
      default () {
        return [];
      },
    },
  },
  data(){
    return{
      planetData : null
    }
  },
  created() {
    console.log(this.externalTableData);
  },
  methods:{
    clicked(data){
      this.planetData = data;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
@import "~bootstrap/dist/css/bootstrap.css";
h3 {
  margin: 40px 0 0;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
