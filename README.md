 HEAD
# api-vote
API de gestion de votes et commentaires, où les utilisateurs peuvent voter sur les posts d'autres membres et commenter. Un administrateur modère les contenus et gère les autorisations pour garantir un environnement respectueux et constructif.

## Technologies

- **Node.js**
- **TypeScript**
- **Express**
- **Firestore** (Base de données)

## Installation


1. Clonez le dépôt :
   ```bash
   git clone https://github.com/votre-utilisateur/api-vote.git
   cd api-vote
   ```
   
Install the project dependencies

```bash
npm install
```

## Developpement

Copy **.env.example** and name it **.env** and set the env variables.

Run the development server:

```bash
npm run dev
```

Open [http://localhost:8080](http://localhost:8080) with your browser to see the result.


### Entites

- **Utilisateurs**
- **Posts**
- **Commentaires**

 ### Endpoints de l'API

Cette section décrit les principaux endpoints disponibles, leurs méthodes HTTP, paramètres et exemples de requêtes et de réponses.

- **Posts**
  Endpoint pour la creation des post par un user
  ```
    router.get('/posts/:id', this.postsController.getPostById.bind(this.postsController));
  ```
  Endpoint pour la mis à jour des post
  ```
  router.put('/posts/:id', authJwt.verifyToken, validateUpdatePost, this.postsController.updatePost.bind(this.postsController));
  ```
  Endpoint pour la suppression des post
  ```
  router.delete('/posts/:id', authJwt.verifyToken, this.postsController.deletePost.bind(this.postsController));
  ```

  
- **Posts**
  

