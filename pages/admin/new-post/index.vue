<template>
  <div class="admin-new-post-page">
    <section class="new-post-form">
      <AdminPostForm @submit="onSubmitted" />
    </section>
  </div>
</template>

<script>
import AdminPostForm from "@/components/Admin/AdminPostForm.vue";

export default {
  layout: "admin",
  middleware: ["check-auth", "auth"],
  components: {
    AdminPostForm,
  },
  methods: {
    async onSubmitted(postData) {
      // postData take from the event submit
      // try {
      //   const res = await fetch(
      //     "https://nuxt-blog-48525-default-rtdb.firebaseio.com/posts.json",
      //     {
      //       method: "POST",
      //       headers: {
      //         "Content-Type": "application/json",
      //       },
      //       body: JSON.stringify({ ...postData, updatedDate: new Date() }),
      //     }
      //   );
      //   const data = await res.json();
      //   console.log(data);
      // this.$router.push("/admin");
      // this.$router.replace("/admin");
      // } catch (err) {
      //   throw err;
      // }
      await this.$store.dispatch("addPost", postData);
      this.$router.replace("/admin");
    },
  },
};
</script>

<style scoped>
.new-post-form {
  width: 90%;
  margin: 20px auto;
}

@media (min-width: 768px) {
  .new-post-form {
    width: 500px;
  }
}
</style>