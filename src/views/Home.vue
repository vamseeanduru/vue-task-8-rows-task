<template>
  <div class="home">
    <h1>Welcome to Homepage</h1>
    <br />
    <p>ABS homepage</p>
    <nav>
      <router-link to="/planet"
        ><button class="btn btn-outline-success">Plants</button>
      </router-link>
    </nav>
    <router-view />
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: "HomeView",
  components: {},
};
</script>

<style>
@import "~bootstrap/dist/css/bootstrap.css";

.btn-outline-success {
  margin-right: 20px;
}
</style>
