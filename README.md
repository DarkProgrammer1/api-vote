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
  Endpoint pour la creation des post 
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

  
- **Comments**

    Endpoint pour la creation des comments
  ```
   router.post('/posts/:postId/comments',authJwt.verifyToken, validateCreateComment,this.commentsController.addCommentToPost.bind(this.commentsController));
  ```
  Endpoint pour la mis à jour des comments
  ```
   router.put('/comments/:id',authJwt.verifyToken,validateUpdateComment,this.commentsController.updateComment.bind(this.commentsController));
  ```
  Endpoint pour la suppression des comments
  ```
   router.delete('/comments/:id',authJwt.verifyToken,this.commentsController.deleteComment.bind(this.commentsController));
  ```

- **Vote**

  Endpoint pour le vote des posts
 ```
 router.post('/posts/:id/vote',authJwt.verifyToken,validateVote,this.postsController.voteOnPost.bind(this.postsController)  
 ```
     Endpoint pour le vote des comments
 ```
  router.post('/comments/:id/vote',authJwt.verifyToken,validateVote,this.commentsController.voteOnComment.bind(this.commentsController));
  ```

  ### Comment ça marche 

  Les endpoints de notre API fournissent un ensemble de fonctionnalités permettant aux utilisateurs de gérer et d’interagir avec des posts et des commentaires. Les utilisateurs peuvent créer des posts, les consulter, les mettre à jour et les supprimer, tout en ayant la possibilité de commenter les posts des autres. Pour favoriser l'interaction, un système de vote est en place, permettant de voter pour ou contre des posts et des commentaires, ce qui contribue à leur popularité au sein de la communauté. Un administrateur peut modérer le contenu, en ayant des droits étendus pour gérer les utilisateurs et superviser les posts et commentaires. Tous les endpoints nécessitant des permissions spécifiques sont sécurisés par des tokens JWT, et des validations de données sont mises en place pour garantir l'intégrité des informations transmises.

  ### Methodes HTTP

  ```
  Post
  ```
  ```
  Get
  ```
  ```
  Put
  ```
  ```
  Delete
  ```

  

