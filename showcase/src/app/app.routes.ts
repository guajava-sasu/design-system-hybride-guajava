import { Routes } from '@angular/router';
import { ActionColorsPage } from './pages/action-colors-page';
import { ActionsNavigationPage } from './pages/actions-navigation-page';
import { AdvancedPatternsPage } from './pages/advanced-patterns-page';
import { ColorsPage } from './pages/colors-page';
import { ComponentsOverviewPage } from './pages/components-overview-page';
import { DataFeedbackPage } from './pages/data-feedback-page';
import { FormsPage } from './pages/forms-page';
import { FoundationsOverviewPage } from './pages/foundations-overview-page';
import { HomePage } from './pages/home-page';
import { IconographyPage } from './pages/iconography-page';
import { InstallationPage } from './pages/installation-page';
import { LayoutUtilitiesPage } from './pages/layout-utilities-page';
import { SpacingPage } from './pages/spacing-page';
import { TypographyPage } from './pages/typography-page';

export interface NavItem {
  readonly path: string;
  readonly label: string;
}

export interface NavGroup {
  readonly label: string;
  readonly items: readonly NavItem[];
}

const suffix = ' · Design system ArcelorMittal';

export const routes: Routes = [
  { path: '', component: HomePage, title: `Accueil${suffix}` },
  { path: 'installation', component: InstallationPage, title: `Installation${suffix}` },
  { path: 'fondations', component: FoundationsOverviewPage, title: `Fondations${suffix}` },
  { path: 'fondations/couleurs', component: ColorsPage, title: `Couleurs${suffix}` },
  { path: 'fondations/typographie', component: TypographyPage, title: `Typographie${suffix}` },
  { path: 'fondations/espacements', component: SpacingPage, title: `Espacements${suffix}` },
  { path: 'fondations/couleurs-action', component: ActionColorsPage, title: `Couleurs d'action${suffix}` },
  { path: 'fondations/iconographie', component: IconographyPage, title: `Iconographie${suffix}` },
  { path: 'composants', component: ComponentsOverviewPage, title: `Composants${suffix}` },
  { path: 'composants/actions-navigation', component: ActionsNavigationPage, title: `Actions & navigation${suffix}` },
  { path: 'composants/formulaires', component: FormsPage, title: `Formulaires${suffix}` },
  { path: 'composants/donnees-feedback', component: DataFeedbackPage, title: `Données & feedback${suffix}` },
  { path: 'composants/mise-en-page', component: LayoutUtilitiesPage, title: `Mise en page${suffix}` },
  { path: 'composants/motifs-avances', component: AdvancedPatternsPage, title: `Motifs avancés${suffix}` },
  { path: '**', redirectTo: '' },
];

export const navigation: readonly NavGroup[] = [
  {
    label: 'Démarrer',
    items: [
      { path: '/', label: 'Accueil' },
      { path: '/installation', label: 'Installation' },
    ],
  },
  {
    label: 'Fondations',
    items: [
      { path: '/fondations', label: "Vue d'ensemble" },
      { path: '/fondations/couleurs', label: 'Couleurs' },
      { path: '/fondations/typographie', label: 'Typographie' },
      { path: '/fondations/espacements', label: 'Espacements' },
      { path: '/fondations/couleurs-action', label: "Couleurs d'action" },
      { path: '/fondations/iconographie', label: 'Iconographie' },
    ],
  },
  {
    label: 'Composants',
    items: [
      { path: '/composants', label: 'Essentiels' },
      { path: '/composants/actions-navigation', label: 'Actions & navigation' },
      { path: '/composants/formulaires', label: 'Formulaires' },
      { path: '/composants/donnees-feedback', label: 'Données & feedback' },
      { path: '/composants/mise-en-page', label: 'Mise en page' },
      { path: '/composants/motifs-avances', label: 'Motifs avancés' },
    ],
  },
];
