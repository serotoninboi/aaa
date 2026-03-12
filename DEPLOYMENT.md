# PixelForge v2.0 - Guide de Déploiement

Cette version de PixelForge est optimisée pour la production avec un design Cyber-Noir amélioré, Supabase Auth, et un système de gestion de crédits auditée.

## 🚀 Étapes de Déploiement

### 1. Provisionnez Supabase
Supabase fournit l'authentification, la base de données Postgres et les triggers. Créez un projet et notez l'URL et la clé Anon.
Importez le contenu de `supabase-migration.sql` dans le SQL Editor pour créer les tables `users`, `billing`, `generations`, `credit_transactions`, et les fonctions RLS/crédits.

### 2. Configuration des Variables d'Environnement
Créez un fichier `.env.local` (ou configurez les variables dans votre plateforme) :

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_public_anon_key
HUGGINGFACE_TOKEN=hf_your_token_here
NODE_ENV=production
```

Ajoutez `http://localhost:3000` et vos domaines de production dans les URL de redirection de Supabase (voir `SUPABASE_SETUP.md`).

### 3. Déploiement
Poussez votre code sur GitHub, connectez-le à Vercel ou un autre hôte, et déployez. Assurez-vous que les variables ci-dessus sont présentes dans l'environnement de production, puis exécutez :

```bash
pnpm install
pnpm build
```

### 4. Déploiement sur Vercel (Recommandé)
1. Poussez votre code sur un dépôt GitHub.
2. Connectez votre dépôt à Vercel.
3. Ajoutez les variables d'environnement ci-dessus dans les paramètres Vercel.
4. Vercel détectera automatiquement Next.js et lancera le build.

## 🛠️ Améliorations de la v2.0
- **Design Cyber-Noir** : Interface immersive avec effets de flou (glassmorphism) et accents néon.
- **Système de Crédits** : Chaque utilisateur commence avec 10 crédits. Les générations déduisent des crédits.
- **Persistance DB** : Les utilisateurs et les générations sont stockés dans Supabase Postgres avec RLS et triggers.
- **Page Tarification** : Structure prête pour l'intégration de processeurs de paiement (SegPay, Epoch).
- **Sécurité** : Supabase Auth protège les routes API et garantit des sessions cohérentes.

## 🔞 Note sur le Contenu Adulte
Pour le déploiement de contenu adulte, assurez-vous de :
1. Utiliser un processeur de paiement compatible (SegPay, CCBill).
2. Ajouter les mentions légales requises (2257 compliance aux USA, etc.).
3. Configurer les filtres de contenu si nécessaire sur vos modèles d'IA.
