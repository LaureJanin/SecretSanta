# Schéma de la base de données (Prisma)

## Table User (Nouveau - Authentification)
- `id` (UUID, primary key)
- `email` (string, unique)
- `name` (string)
- `password` (string, nullable) — Hash du mot de passe ou null si connexion par email magic link
- `createdAt` (datetime)

## Table Lottery (Mise à jour avec propriété)
- `id` (UUID, primary key)
- `name` (string)
- `year` (int)
- `createdAt` (datetime)
- `ownerId` (UUID, FK → User) — **Nouveau** : Qui a créé cette loterie

## Table Participant
- `id` (UUID, primary key)
- `name` (string)
- `email` (string, unique, nullable)
- `loginCode` (string, unique, nullable)
- `isActive` (boolean) — true = participe à la loterie, false = profil enfant/hors tirage
- `lotteryId` (UUID, FK → Lottery)
- `createdAt` (datetime)

## Table GiftIdea
- `id` (UUID, primary key)
- `participantId` (UUID, FK → Participant)
- `title` (string)
- `description` (string, nullable)
- `link` (string, nullable)
- `createdAt` (datetime)

## Table Exclusion
- `id` (UUID, primary key)
- `lotteryId` (UUID, FK → Lottery)
- `participantId` (UUID, FK → Participant)
- `excludedId` (UUID, FK → Participant)

## Table Draw
- `id` (UUID, primary key)
- `lotteryId` (UUID, FK → Lottery)
- `giverId` (UUID, FK → Participant)
- `receiverId` (UUID, FK → Participant)

## Table ParticipantManager
- `id` (UUID, primary key)
- `childId` (UUID, FK → Participant)
- `managerId` (UUID, FK → Participant)

---

## **Nouvelles fonctionnalités de sécurité :**

### **Authentification JWT :**
- Chaque utilisateur s'inscrit avec email + mot de passe
- Tokens JWT avec expiration de 7 jours
- Hashage sécurisé des mots de passe avec bcrypt

### **Isolation des données :**
- ✅ **Chaque utilisateur ne voit que SES loteries**
- ✅ **Impossible d'accéder aux loteries des autres**
- ✅ **Contrôle de propriété** sur toutes les opérations (tirage, emails, etc.)

### **API GraphQL sécurisée :**

**Queries publiques :**
- `participantByLoginCode` — Pour que les participants accèdent à leurs idées cadeaux

**Queries protégées (authentification requise) :**
- `me` — Informations de l'utilisateur connecté
- `myLotteries` — Toutes les loteries de l'utilisateur
- `myLottery(id)` — Une loterie spécifique (si propriétaire)

**Mutations protégées (authentification + propriété requises) :**
- `createLottery` — Créer une nouvelle loterie
- `addParticipant` — Ajouter des participants
- `addExclusion` — Gérer les exclusions
- `performDraw` — Lancer le tirage au sort
- `sendLoginCodes` — Envoyer les codes de connexion par email
- `sendDrawResults` — Envoyer les résultats du tirage par email
- `testGmailDirect` — Tester la configuration Gmail

---

## **Service Email intégré :**

### **Gmail SMTP uniquement :**
- ✅ **Mailjet supprimé** — Plus fiable avec Gmail
- ✅ **Templates HTML** inclus pour les emails
- ✅ **Envoi par batch** pour éviter les limites
- ✅ **Gestion d'erreurs** complète

### **Types d'emails envoyés :**
1. **Code de connexion** — Pour que les participants accèdent à la plateforme
2. **Résultats du tirage** — Révèle à chaque donneur qui est son receveur + idées cadeaux

---

## **Règles métier inchangées :**

- Les participants "enfants" ou hors tirage ont `isActive = false`, pas d'email ni de code de connexion, mais peuvent avoir des idées cadeaux.
- Seuls les participants actifs sont inclus dans le tirage et reçoivent un code de connexion.
- Les exclusions et tirages sont liés à une loterie précise.
- Les idées cadeaux des enfants sont visibles par tous, modifiables par leurs managers.
- Un enfant peut avoir plusieurs managers (parents/adultes responsables).

---

## **Architecture finale :**

```
User (Administrateur)
├── Lottery 1 (sa propriété)
│   ├── Participants
│   ├── Exclusions  
│   ├── Draws
│   └── GiftIdeas (via Participants)
├── Lottery 2 (sa propriété)
└── ...
```

**Chaque utilisateur gère ses propres loteries de façon complètement isolée et sécurisée.**
