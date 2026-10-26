# 🛡️ Veille cyber automatisée (Node.js + IA)

Outil en ligne de commande qui récupère les dernières publications du **CERT-FR**
et en génère un résumé priorisé grâce à un LLM (API Gemini).

## Fonctionnement
1. Lecture du flux RSS du CERT-FR (`rss-parser`)
2. Pour chaque alerte : titre, date, extrait du contenu et lien
3. Envoi à l'API Gemini avec un prompt d'analyste cyber, qui demande de ne rien
   inventer et de citer les sources
4. Affichage d'une synthèse : produits concernés et priorités

## Technologies
Node.js · JavaScript (ES6+, modules, async/await) · API REST · Gemini API · npm

## Prérequis
- Node.js 20.6 ou plus récent (pour l'option `--env-file`)
- Une clé d'API Gemini ([Google AI Studio](https://aistudio.google.com/apikey))

## Installation
```bash
git clone https://github.com/abderrahim-meziane/veille-cyber.git
cd veille-cyber
npm install
```

Créer un fichier `.env` à partir de `.env.example` et y mettre sa clé Gemini.

## Utilisation
```bash
npm run veille
```

## Sécurité
- La clé d'API est lue depuis une variable d'environnement et n'est jamais versionnée (`.env` est dans `.gitignore`)
- Les erreurs (clé manquante, flux inaccessible, réponse de l'API) sont gérées avec un message clair

## Limites et améliorations prévues
- Le modèle travaille sur un extrait de chaque alerte, pas sur la page complète :
  le résumé reste à vérifier sur les liens fournis
- Sauvegarde des résumés dans des fichiers datés
- Filtrage par produit ou par niveau de criticité
- Exposition via une API REST (Express)
- Tests automatisés (Jest)

## Contexte
Projet personnel : portage en Node.js d'un outil de veille que j'avais
développé en Python, pour apprendre l'écosystème JavaScript côté serveur.
