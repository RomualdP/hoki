# Backup - Migration vers Mono-Repo Hoki

Date de migration : $(date)

## Repos Git existants

### Backend
- **Repo GitHub** : https://github.com/RomualdP/volley_app_back.git
- **Branche actuelle** : feature/coach-same-permissions-as-owner
- **Chemin local** : volley-app-backend/

### Frontend
- **Repo GitHub** : https://github.com/RomualdP/volley_app_front.git
- **Branche actuelle** : feature/coach-same-permissions-as-owner
- **Chemin local** : volley-app-frontend/

## Nouveau repo Mono-Repo

- **Nom du projet** : Hoki
- **Repo GitHub** : https://github.com/RomualdP/hoki.git
- **Structure** : Option A (Simple)
- **Méthode historique** : Git Subtree Merge

## URLs de déploiement (à reconnecter après migration)

### Vercel (Frontend)
- URL actuelle : [À documenter par l'utilisateur]
- Configuration : Root Directory sera `volley-app-frontend`

### Railway (Backend)
- URL actuelle : [À documenter par l'utilisateur]
- Configuration : Root Directory sera `volley-app-backend`

## Notes

Les repos originaux restent disponibles sur GitHub pour référence historique.
La migration conserve tout l'historique Git grâce à la méthode Git Subtree Merge.

