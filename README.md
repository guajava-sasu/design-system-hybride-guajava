# Design system Guajava

Socle CSS indépendant des frameworks pour les applications des projets ArcelorMittal. Les conventions s'inspirent de Bootstrap, Tailwind CSS, Panda CSS, shadcn/ui et Chakra UI, tout en donnant la priorité aux recommandations de marque fournies dans ce dépôt de travail.

## Démarrage

Après publication sur le registre privé de l'entreprise :

```sh
npm install @guajava-sasu/design-system
```

Importez la feuille de style dans votre application :

```css
@import "@guajava-sasu/design-system";
```

Ou dans un fichier JavaScript/TypeScript pris en charge par votre outil :

```js
import "@guajava-sasu/design-system";
```

Exemple HTML sans framework :

```html
<main class="am-container am-flow">
  <h1>Un titre clair et lisible</h1>
  <p>Des composants cohérents, accessibles et faciles à réutiliser.</p>
  <a class="am-button am-button--primary" href="/en-savoir-plus">
    En savoir plus
  </a>
</main>
```

Un aperçu des composants et des variables est disponible dans [`docs/index.html`](docs/index.html). Pour le consulter localement, ouvrez ce fichier dans un navigateur.

Pour lancer le serveur de développement et tester les interactions :

```sh
npm run dev
```

Puis ouvrez [http://127.0.0.1:4321](http://127.0.0.1:4321). Définissez `PORT` pour utiliser un autre port.

## Ce premier socle comprend

- Des variables CSS pour les couleurs, la typographie, les espacements, les rayons et les ombres.
- Des styles de base, une grille responsive et quelques utilitaires.
- Des boutons, liens, champs, badges, alertes et cartes.
- Les états de focus clavier, des états de formulaire accessibles et le respect de `prefers-reduced-motion`.
- Une documentation avec exemples HTML prêts à adapter.

Les classes sont préfixées par `am-` pour limiter les collisions avec les styles d'une application existante. Les composants restent de simples éléments HTML : aucun framework JavaScript n'est requis.

## Personnalisation

Les applications peuvent surcharger les propriétés personnalisées après l'import :

```css
:root {
  --am-color-accent: #c44508;
  --am-radius-control: 0.375rem;
}
```

Les valeurs de couleur qui ne figurent pas explicitement dans l'export des recommandations sont des valeurs provisoires. Elles sont centralisées dans `tokens.css` et devront être confirmées à partir des sources de marque avant une mise en production.

La vitrine charge les deux fichiers Gilroy WOFF2 fournis dans les sources de branding, depuis `docs/assets/fonts/`. Ces fichiers servent à la documentation et ne sont pas intégrés au paquet npm. Les polices et logos de marque ne sont pas couverts par la licence MIT : confirmez les droits de redistribution avant de publier le dépôt ou de les héberger ailleurs. Une application peut déclarer sa propre police autorisée et surcharger `--am-font-family`.

## Développement

```sh
npm test
npm pack --dry-run
```

Le paquet est préparé sous le nom `@guajava-sasu/design-system`. Le workflow de publication est déclenché par un push sur `main` ou manuellement : il exécute les tests, incrémente la version patch, publie sur le registre configuré, puis enregistre la nouvelle version dans le dépôt. Les registres publics `npmjs.org` et `npmjs.com` sont refusés par le workflow.

Avant d'activer le workflow, configurez la variable GitHub Actions `NPM_REGISTRY_URL` avec l'URL HTTPS du registre privé et le secret `NPM_TOKEN` avec un jeton limité à la publication. Vérifiez le scope du paquet dans `package.json` et la compatibilité de l'option `--access restricted` avec le registre de l'entreprise. Le workflow doit pouvoir pousser un commit de version sur `main` : adaptez les règles de protection de branche et les permissions de `GITHUB_TOKEN` en conséquence.

## Licence et marque

Le code du paquet est distribué sous licence MIT. Cette licence ne couvre pas les marques, logos ou polices ArcelorMittal.
