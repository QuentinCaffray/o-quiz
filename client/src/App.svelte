<header>
  <h1>Oquiz</h1>
  {#if currentUser}
    <span>Connecté en tant que <strong>{currentUser.firstname}</strong> ({currentUser.role})</span>
    <button onclick={handleLogout}>Se déconnecter</button>
  {/if}
</header>

<main>
  <p>Nous sommes le {toReadableDate(new Date())}</p>

  {#if !currentUser}
    <section>
      <h2>Connexion</h2>
      {#if loginError}
        <p class="error">{loginError}</p>
      {/if}
      <form onsubmit={handleLogin}>
        <label>
          Email
          <input type="email" bind:value={email} required />
        </label>
        <label>
          Mot de passe
          <input type="password" bind:value={password} required />
        </label>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Connexion...' : 'Se connecter'}
        </button>
      </form>
    </section>
  {:else}
    {#if isLoading}
      <p>Données en cours de chargement...</p>
    {/if}

    {#if fetchError}
      <p class="error">{fetchError}</p>
    {/if}

    {#if !isLoading && !fetchError && users.length === 0}
      <p>Aucun utilisateur trouvé.</p>
    {/if}

    {#if users.length > 0}
      <h2>Liste des utilisateurs</h2>
      <ul>
        {#each users as user}
          <li>{user.firstname} {user.lastname} — <em>{user.role}</em></li>
        {/each}
      </ul>
    {/if}
  {/if}
</main>

<footer>
  O'Clock - {new Date().getFullYear()} - Tous droits réservés
</footer>

<script lang="ts">
  import { toReadableDate } from "./lib/utils";
  import { api, type UserDTO, type MeDTO } from "./services/api";

  let users = $state<UserDTO[]>([]);
  let currentUser = $state<MeDTO | null>(null);
  let fetchError = $state<string | null>(null);
  let loginError = $state<string | null>(null);
  let isLoading = $state(false);

  // Champs du formulaire
  let email = $state('');
  let password = $state('');

  async function handleLogin(event: SubmitEvent) {
    event.preventDefault();
    isLoading = true;
    loginError = null;

    try {
      currentUser = await api.login({ email, password });
      await fetchUsers();
    } catch (error) {
      loginError = error instanceof Error ? error.message : 'Erreur de connexion';
    } finally {
      isLoading = false;
    }
  }

  async function handleLogout() {
    await api.logout();
    currentUser = null;
    users = [];
    email = '';
    password = '';
  }

  async function fetchUsers() {
    isLoading = true;
    fetchError = null;

    try {
      users = await api.getUsers();
    } catch (error) {
      fetchError = error instanceof Error ? error.message : 'Erreur lors du chargement';
    } finally {
      isLoading = false;
    }
  }
</script>

<style lang="css" scoped>
  h1 {
    text-decoration: underline;
  }

  header {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    max-width: 300px;
  }

  label {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .error {
    color: red;
  }

  footer {
    padding-top: 2rem;
  }
</style>
