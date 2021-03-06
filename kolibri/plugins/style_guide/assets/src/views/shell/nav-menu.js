import sortBy from 'lodash/sortBy';
import flatten from 'lodash/flatten';

import Home from '../content/Home';

import InclusivePage from '../content/Inclusive';
import WritingPage from '../content/Writing';

import ButtonsPage from '../content/Buttons';
import BreadcrumbsPage from '../content/Breadcrumbs';
import NavbarPage from '../content/Navbar';
import CheckboxesPage from '../content/Checkboxes';
import RadioButtonsPage from '../content/RadioButtons';
import TextFieldsPage from '../content/TextFields';
import FiltersPage from '../content/Filters';
import DropdownMenusPage from '../content/DropdownMenus';
import LoadersPage from '../content/Loaders';
import ModalsPage from '../content/Modals';
import GridsPage from '../content/Grids';

function sortSectionItems(items) {
  return sortBy(items, [item => item.itemName]);
}

const homeRoute = [
  {
    path: `/`,
    component: Home,
  },
];

// This data structure contains the navigational links pointing to all the
// content pages in the style guide.
// Notes: This is view-agnostic; it doesn't make assumption on how it will be
// rendered (whether it's a side-nav or a horizontal menu).
const navMenu = [
  {
    sectionName: 'Patterns',
    sectionItems: [
      {
        itemName: 'Inclusive design',
        itemRoute: {
          path: `/patterns/inclusive`,
          component: InclusivePage,
        },
      },
      {
        itemName: 'Writing style',
        itemRoute: {
          path: `/patterns/writing`,
          component: WritingPage,
        },
      },
    ],
  },
  {
    sectionName: 'Components',
    sectionItems: sortSectionItems([
      {
        itemName: 'Buttons and links',
        itemRoute: {
          path: `/components/buttons`,
          component: ButtonsPage,
        },
      },
      {
        itemName: 'Topic tree breadcrumbs',
        itemRoute: {
          path: `/components/breadcrumbs`,
          component: BreadcrumbsPage,
        },
      },
      {
        itemName: 'Horizontal navbar',
        itemRoute: {
          path: `/components/navbar`,
          component: NavbarPage,
        },
      },
      {
        itemName: 'Checkboxes',
        itemRoute: {
          path: `/components/checkboxes`,
          component: CheckboxesPage,
        },
      },
      {
        itemName: 'Radio Buttons',
        itemRoute: {
          path: `/components/radio-buttons`,
          component: RadioButtonsPage,
        },
      },
      {
        itemName: 'Text Fields',
        itemRoute: {
          path: `/components/text-fields`,
          component: TextFieldsPage,
        },
      },
      {
        itemName: 'Filters',
        itemRoute: {
          path: `/components/filters`,
          component: FiltersPage,
        },
      },
      {
        itemName: 'Dropdown menus',
        itemRoute: {
          path: `/components/dropdown-menus`,
          component: DropdownMenusPage,
        },
      },
      {
        itemName: 'Loaders',
        itemRoute: {
          path: `/components/loaders`,
          component: LoadersPage,
        },
      },
      {
        itemName: 'Modals',
        itemRoute: {
          path: `/components/modals`,
          component: ModalsPage,
        },
      },
      {
        itemName: 'Grids',
        itemRoute: {
          path: `/components/grids`,
          component: GridsPage,
        },
      },
    ]),
  },
];

// Extract the routes from the sideNavMenu so they can be added to VueRouter.
// Add in the path to the home page.
const navMenuRoutes = flatten(
  homeRoute.concat(navMenu.map(menuSection => menuSection.sectionItems.map(link => link.itemRoute)))
);

export { navMenu, navMenuRoutes };
