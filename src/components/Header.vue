<template>
  <div>
    <header class="header">
      <div class="container header__container">
        <a href="#" class="header__logo">
          <svg class="icon">
            <use xlink:href="../../src/assets/sprite.svg#logo"></use>
          </svg>
          Система <br>
          таблиц
        </a>
        <a href="#" class="header__user">
          <div class="header__user-name">
            Светлана <span>Сотрудник</span>
          </div>
          <div class="header__user-icon">
            <img src="../assets/img/user-photo.jpg" alt="user">
          </div>
        </a>
      </div>
    </header>
  </div>
</template>

<script>

export default {
  methods: {},
  computed: {},
  data() {
    return {}
  },
}
</script>

<style lang="scss">
.header {
  background: #FFFFFF;
  padding: 20px 0;
  margin-bottom: 36px;
}
.header__container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header__logo {
  font-weight: 800;
  font-size: 16px;
  line-height: 1.12;
  text-transform: uppercase;
  color: #006CFE;
  display: flex;
  text-decoration: none;
  svg {
    width: 41px;
    height: 33px;
    margin-right: 10px;
  }
}
.header__user {
  display: flex;
  align-items: center;
  text-decoration: none;
}
.header__user-icon {
  display: flex;
  img {
    height: 100%;
    width: 100%;
    border-radius: 50%;
  }
}
.header__user-name {
  font-weight: 700;
  font-size: 14px;
  text-align: right;
  color: #006CFE;
  margin-right: 10px;

  span {
    font-weight: 400;
    font-size: 14px;
    color: #8D9FB7;
    display: block;
  }

}

</style>
