<!-- NotFound.vue -->
<template>
  <div class="not-found">
    <div class="content">
      <h1 class="title">404</h1>
      <p class="subtitle">Page Not Found</p>
      <p class="description">Sorry, the page you are looking for does not exist.</p>
      <button class="home-link" @click="No">Go to Home Page</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotFound',
  data () {
    return {
      // count: 5
    }
  },
  methods: {
    No () {
      this.$router.replace('/')
    }
  }
}
</script>

<style scoped>
.not-found {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f2f5;
}

.content {
  text-align: center;
  color: #333;
}

.title {
  font-size: 10vh;
  font-weight: bold;
  margin: 0;
}

.subtitle {
  font-size: 2vh;
  margin: 0;
}

.description {
  font-size: 3.2vh;
  margin: 20px 0;
}

.home-link {
  display: inline-block;
  padding: 10px 20px;
  background-color: #42b983;
  color: #fff;
  text-decoration: none;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.home-link:hover {
  background-color: #38a169;
}
</style>
