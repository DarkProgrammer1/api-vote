markdown
Copy code
# SyncVote REST API

API de gestion de votes et de commentaires où les utilisateurs peuvent voter sur les posts d'autres membres et commenter. Un administrateur modère les contenus et gère les autorisations pour garantir un environnement respectueux et constructif.

## Technologies

- **Node.js**
- **TypeScript**
- **Express**
- **Firestore** (Base de données)

---

## Installation

1. Clonez le dépôt :
   ```bash
   git clone https://github.com/votre-utilisateur/api-vote.git
   cd api-vote
Installez les dépendances du projet :

bash
Copy code
npm install
Configurez les variables d'environnement :

Copiez le fichier .env.example, renommez-le en .env et ajustez les valeurs nécessaires.
Lancez le serveur de développement :

bash
Copy code
npm run dev
Ouvrez http://localhost:8080 dans votre navigateur pour voir le résultat.

Créer un administrateur
Pour créer un utilisateur administrateur, exécutez la commande suivante :

bash
Copy code
npm run create-admin
Endpoints de l'API
Voici les principaux endpoints disponibles, leurs méthodes HTTP, paramètres et exemples de requêtes et de réponses.

Table des Matières
Posts
Créer un Post
Récupérer un Post par ID
Upvote/Downvote un Post
Commentaires
Ajouter un Commentaire à un Post
Récupérer les Commentaires d’un Post
Récupérer un Commentaire par ID
Mettre à Jour un Commentaire
Supprimer un Commentaire
Upvote/Downvote un Commentaire
Posts
Créer un Post
Méthode HTTP : POST
Endpoint : /posts
Accès : Utilisateurs connectés
Corps (Body)
json
Copy code
{
  "title": "Mon post",
  "description": "Description du post",
  "categories": ["tech", "science"]
}
Exemple de Réponse
json
Copy code
{
  "status": 201,
  "message": "Post créé avec succès!"
}
Récupérer un Post par ID
Méthode HTTP : GET
Endpoint : /posts/:id
Accès : Tous les utilisateurs, y compris les invités
Exemple de Réponse
json
Copy code
{
  "status": 200,
  "message": "Post récupéré avec succès!",
  "data": {
    "id": "postId123",
    "title": "Nouveau Post",
    "description": "Description du post",
    "categories": ["tech", "science"],
    "createdBy": "userId123",
    "createdAt": "2024-01-01T12:00:00Z",
    "voteCount": 5
  }
}
Upvote/Downvote un Post
Méthode HTTP : POST
Endpoint : /posts/:id/vote
Accès : Utilisateurs connectés
Corps (Body)
json
Copy code
{
  "voteType": "upvote"
}
Exemple de Réponse
json
Copy code
{
  "status": 200,
  "message": "Vote appliqué avec succès!",
  "data": {
    "postId": "postId123",
    "voteCount": 6
  }
}
Commentaires
Ajouter un Commentaire à un Post
Méthode HTTP : POST
Endpoint : /posts/:postId/comments
Accès : Utilisateurs connectés
Corps (Body)
json
Copy code
{
  "description": "Ceci est un commentaire."
}
Exemple de Réponse
json
Copy code
{
  "status": 201,
  "message": "Commentaire ajouté avec succès!",
  "data": {
    "id": "commentId123",
    "description": "Ceci est un commentaire.",
    "postid": "postId123",
    "createdBy": "userId123",
    "createdAt": "2024-01-01T12:00:00Z"
  }
}
Récupérer les Commentaires d’un Post
Méthode HTTP : GET
Endpoint : /posts/:postId/comments
Accès : Tous les utilisateurs, y compris les invités
Exemple de Réponse
json
Copy code
{
  "status": 200,
  "message": "Commentaires récupérés avec succès!",
  "data": [
    {
      "id": "commentId123",
      "description": "Ceci est un commentaire.",
      "postid": "postId123",
      "createdBy": "userId123",
      "createdAt": "2024-01-01T12:00:00Z"
    }
  ]
}
Récupérer un Commentaire par ID
Méthode HTTP : GET
Endpoint : /comments/:id
Accès : Tous les utilisateurs, y compris les invités
Exemple de Réponse
json
Copy code
{
  "status": 200,
  "message": "Commentaire récupéré avec succès!",
  "data": {
    "id": "commentId123",
    "description": "Ceci est un commentaire.",
    "postid": "postId123",
    "createdBy": "userId123",
    "createdAt": "2024-01-01T12:00:00Z"
  }
}
Mettre à Jour un Commentaire
Méthode HTTP : PUT
Endpoint : /comments/:id
Accès : Admin ou propriétaire du commentaire
Corps (Body)
json
Copy code
{
  "description": "Mise à jour du contenu du commentaire."
}
Exemple de Réponse
json
Copy code
{
  "status": 200,
  "message": "Commentaire mis à jour avec succès!",
  "data": {
    "id": "commentId123",
    "description": "Mise à jour du contenu du commentaire.",
    "postid": "postId123",
    "createdBy": "userId123",
    "createdAt": "2024-01-01T12:00:00Z",
    "updatedAt": "2024-01-02T14:00:00Z"
  }
}
Supprimer un Commentaire
Méthode HTTP : DELETE
Endpoint : /comments/:id
Accès : Admin ou propriétaire du commentaire
Exemple de Réponse
json
Copy code
{
  "status": 200,
  "message": "Commentaire supprimé avec succès!"
}
Upvote/Downvote un Commentaire
Méthode HTTP : POST
Endpoint : /comments/:id/vote
Accès : Utilisateurs connectés
Corps (Body)
json
Copy code
{
  "voteType": "upvote"
}
Exemple de Réponse
json
Copy code
{
  "status": 200,
  "message": "Vote appliqué avec succès!",
  "data": {
    "commentId": "commentId123",
    "voteCount": 3
  }
}
