<template>
  <div class="container">
    <div>
      <h1>Add New Planet</h1>
      <br />
      <input type="text" v-model="addPlanets.name" placeholder="Enter Name" />
      <br />
      <input
        type="text"
        v-model="addPlanets.rotation_period"
        placeholder="Enter Rotation Period"
      />
      <br />
      <input
        type="text"
        v-model="addPlanets.terrain"
        placeholder="Enter Terrain"
      />
      <br />
      <input
        type="text"
        v-model="addPlanets.population"
        placeholder="Enter Population"
      />
      <br />
      <button
        @click="addPlanetsToTable"
        class="btn btn-warning"
        :disabled="!isDisabled"
      >
        Add Planet
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "NewForm",
  data() {
    return {
      addPlanets: {
        name: null,
        rotation_period: null,
        terrain: null,
        population: null,
      },
    };
  },
  methods: {
    addPlanetsToTable() {
      this.$emit("addPlanetsToTable", this.addPlanets);
    },
  },
  computed: {
    isDisabled() {
      return (
        this.addPlanets.name !== null &&
        this.addPlanets.rotation_period !== null &&
        this.addPlanets.terrain !== null &&
        this.addPlanets.population !== null
      );
    },
  },
};
</script>

<style>
@import "~bootstrap/dist/css/bootstrap.css";

input {
  margin-bottom: 20px;
  width: 20%;
  font-size: 16px;
  font-size: max(16px, 1em);
  font-family: inherit;
  padding: 0.25em 0.5em;
  background-color: #fff;
  border: 2px solid #000;
  border-radius: 4px;
}
</style>
