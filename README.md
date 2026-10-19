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
  --am-color-accent: #ff3700;
  --am-color-sky-blue: #0072ce;
  --am-radius-control: 0.375rem;
}
```

La palette web officielle et ses associations sont documentées dans la galerie. Le dégradé master va de `#000014` à `#FFDF88`, mais le dégradé web s'arrête à `#F09357`. Les couleurs d'action fonctionnelles non présentes dans la palette restent réservées à leurs états ; les couleurs exceptionnelles de récit/illustration doivent être approuvées par l'équipe de marque. Toute autre valeur non explicitement fournie par la charte est provisoire.

La charte demande Gilroy Regular pour les textes et Gilroy SemiBold pour les titres :

```css
font-family: "GilroyforArcelorMittal", sans-serif;
font-family: "GilroyforArcelorMittal-SmBd", sans-serif;
```

Ces familles sont configurées dans `--am-font-family` et `--am-font-family-heading`. La vitrine charge les fichiers Gilroy WOFF2 fournis dans les sources de branding depuis `docs/assets/fonts/`, mais ne les intègre pas au paquet npm. Les polices et logos de marque ne sont pas couverts par la licence MIT : confirmez les droits de redistribution avant de publier le dépôt ou de les héberger dans une application. Les applications clientes doivent héberger les fichiers autorisés puis déclarer les familles correspondantes.

Les styles `h1` à `h5` et les classes `.am-h1` à `.am-h5` partagent les tailles et interlignes de la charte. `.am-body-1`, `.am-body-1--semibold`, `.am-body-2` et `.am-label` exposent les styles de texte. Les espacements de mise en page Frontify sont disponibles en tokens (`--am-layout-space-*`), en classes `am-layout-gap-*` et `am-layout-padding-*`. La grille utilise les tokens `--am-grid-columns`, `--am-grid-columns-tablet` et `--am-grid-columns-mobile`. `--am-focus-outline-width` et `--am-focus-outline-offset` règlent l'indicateur de focus ; `--am-icon-size` et `--am-icon-stroke-width` règlent les icônes. La galerie locale montre aussi la grille d'icônes 24 × 24 px et un exemple de loupe.

Les tokens `--am-action-disabled`, `--am-action-positive` et `--am-action-alert` sont réservés aux notifications fonctionnelles : état indisponible d'un CTA, succès et alerte. Les alertes gardent un fond et un texte neutres, et ces couleurs ne servent ni aux titres, ni au corps de texte, ni aux liens, listes, tableaux ou fonds de modules.

Les boutons CTA et les boutons icônes révèlent le dégradé web au survol/focus avec un voile sombre de 40 % pour préserver le contraste du premier plan blanc. `am-theme--*` associe un fond de module à une couleur de texte recommandée ; `.am-button--hot-orange-white` propose le premier plan blanc autorisé sur orange. `.am-brand-pair` et ses variantes illustrent les paires de couleurs approuvées dans le guide. `.am-kicker`, `.am-badge--accent`, `.am-badge--sky` et `.am-breadcrumb` couvrent les usages d'accent autorisés. `.am-table`, `.am-table-wrap` et `.am-table-sort` composent une table responsive, avec exemple HTML et JavaScript copiable dans la galerie.

## Développement

```sh
npm test
npm pack --dry-run
```

Le paquet est préparé sous le nom `@guajava-sasu/design-system`. Le workflow de publication est déclenché par un push sur `main` ou manuellement : il exécute les tests, incrémente la version patch, publie sur le registre configuré, puis enregistre la nouvelle version dans le dépôt. Les registres publics `npmjs.org` et `npmjs.com` sont refusés par le workflow.

Avant d'activer le workflow, configurez la variable GitHub Actions `NPM_REGISTRY_URL` avec l'URL HTTPS du registre privé et le secret `NPM_TOKEN` avec un jeton limité à la publication. Vérifiez le scope du paquet dans `package.json` et la compatibilité de l'option `--access restricted` avec le registre de l'entreprise. Le workflow doit pouvoir pousser un commit de version sur `main` : adaptez les règles de protection de branche et les permissions de `GITHUB_TOKEN` en conséquence.

## Licence et marque

Le code du paquet est distribué sous licence MIT. Cette licence ne couvre pas les marques, logos ou polices ArcelorMittal.
