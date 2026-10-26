import Parser from "rss-parser";

const FLUX_CERT = "https://www.cert.ssi.gouv.fr/feed/";
const NB_ALERTES = 10;

const cle = process.env.GEMINI_API_KEY;
const modele = process.env.GEMINI_MODEL || "gemini-3.5-flash";

if (!cle) {
  console.error("Erreur : GEMINI_API_KEY manquante. Copiez .env.example en .env et renseignez votre clé.");
  process.exit(1);
}

// 1. Récupérer les alertes du CERT-FR
let flux;
try {
  flux = await new Parser().parseURL(FLUX_CERT);
} catch (err) {
  console.error("Erreur : impossible de lire le flux du CERT-FR :", err.message);
  process.exit(1);
}

// Titre + date + extrait + lien : le modèle s'appuie sur le contenu réel
// des alertes plutôt que de deviner à partir du seul titre.
const alertes = flux.items
  .slice(0, NB_ALERTES)
  .map((a) => {
    const date = a.isoDate ? a.isoDate.slice(0, 10) : "date inconnue";
    const extrait = (a.contentSnippet || "").replace(/\s+/g, " ").slice(0, 500);
    return `- [${date}] ${a.title}\n  Extrait : ${extrait}\n  Lien : ${a.link}`;
  })
  .join("\n");

// 2. Préparer la consigne pour l'IA
const prompt = `Tu es analyste en cybersécurité. Voici les dernières publications du CERT-FR :
${alertes}

Fais un résumé en français, en 5 points maximum, en indiquant les produits concernés et ce qui est prioritaire.
Appuie-toi uniquement sur les informations ci-dessus, sans rien inventer, et cite le lien de chaque alerte mentionnée.`;

// 3. Envoyer la demande à Gemini
const res = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/${modele}:generateContent`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": cle,
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
    }),
  }
);

const data = await res.json();

if (!res.ok) {
  console.error("Erreur API Gemini :", data.error?.message);
  process.exit(1);
}

// 4. Afficher le résumé
const texte = data.candidates?.[0]?.content?.parts?.[0]?.text;
if (!texte) {
  console.error("Erreur : réponse vide du modèle.");
  process.exit(1);
}
console.log(texte);
