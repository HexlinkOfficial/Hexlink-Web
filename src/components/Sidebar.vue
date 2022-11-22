<template>
  <aside :class="`${is_expanded && 'is_expanded'}`">
    <div className="logo">
      <img  src="../assets/white-logo.svg" alt="hexlink"/>
    </div>

    <div class="menu-toggle-wrap">
      <button class="menu-toggle" @click="ToggleMenu">
        <span class="material-icons">keyboard_double_arrow_right</span>
      </button>
    </div>

    <h3>Menu</h3>
    <div className="menu">
      <router-link to="/" class="button">
        <span class="material-icons">monetization_on</span>
        <span className="text">Tokens</span>
      </router-link>
      <router-link to="/activities" class="button">
        <span class="material-icons">receipt_long</span>
        <span className="text">Transactions</span>
      </router-link>
      <router-link to="/collectible" class="button">
        <span class="material-icons">grid_on</span>
        <span className="text">NFT</span>
      </router-link>
      <router-link to="/testhome" class="button">
        <span class="material-icons">home</span>
        <span className="text">Home</span>
      </router-link>
      <router-link to="/testabout" class="button">
        <span class="material-icons">description</span>
        <span className="text">About</span>
      </router-link>
    </div>
  </aside>
  
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  // import { useRouter } from 'vue-router';
  
  const is_expanded = ref(false)
  const ToggleMenu = () => {
    is_expanded.value = !is_expanded.value
  }
</script>

<style lang="scss" scoped>
aside {
  display: flex;
  flex-direction: column;
  width: calc(2rem + 32px);
  min-height: 100vh;
  overflow: hidden;
  padding: 1rem;

  background-color: var(--dark);
  color: var(--light);

  transition: 0.2s ease-in-out;

  .logo {
    margin-bottom: 1rem;
    img {
      width: 2rem; }
  }

  .menu-toggle-wrap {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 1rem;
    position: relative;
    top: 0;
    transition: 0.2s ease-in-out;

    .menu-toggle {
      transition: 0.2s ease-in-out;
  
      .material-icons {
        font-size: 2rem;
        color: var(--light);
        transition: 0.2s ease-out;
      }
  
      &:hover {
        .material-icons {
          color: var(--primary);
          transform: translateX(0.5rem);
        }
      }
    }
  }

  h3, .button .text {
		opacity: 0;
		transition: opacity 0.3s ease-in-out;
	}
	h3 {
		color: var(--grey);
		font-size: 0.875rem;
		margin-bottom: 0.5rem;
		text-transform: uppercase;
	}

  .menu {
    margin: 0 -1rem;

    .button {
      display: flex;
      align-items: center;
      text-decoration: none;

      padding: 0.5rem 1rem;
      transition: 0.2s ease-in-out;

      .material-icons {
        font-size: 2rem;
        color: var(--light);
        transition: 0.2s ease-in-out;
      }
      .text {
        color: var(--light);
        transition: 0.2s ease-in-out;
      }

      &:hover, &.router-link-active {
        background-color: var(--dark-alt);

        .material-icons, .text {
          color: var(--primary);
        }
      }

      &.router-link-active {
        background-color: var(--dark-alt);
        border-right: 5px solid var(--primary);

        .material-icons, .text {
          color: var(--primary);
        }
      }
    }
  }

  &.is_expanded {
    width: var(--sidebar-width);

    .menu-toggle-wrap {
      top: -3rem;
  
      .menu-toggle {
        transform: rotate(-180deg);
      }
    }
    
    h3, .button .text {
      opacity: 1;
    }
  
    .button {
      .material-icons {
        margin-right: 1rem;
      }
    }
  
    .footer {
      opacity: 0;
    }
  }

  @media (max-width: 768px) {
    position: fixed;
    z-index: 99;
  }
}
</style>