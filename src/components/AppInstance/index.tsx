import React from 'react';
import { EgeriaApp, RequireAuth, EgeriaAbout } from '@lfai/egeria-ui-core';

import {
  EgeriaAssetCatalog,
  EgeriaAssetDetails,
  EgeriaGlossary,
  EgeriaLineageGraphRouteWrapper,
  EgeriaLineageGraphPrint,
} from '@lfai/egeria-ui-components';

import { Routes, Route } from 'react-router-dom';
import { menuIcons } from '@lfai/egeria-js-commons';

const menu = [
  { customIcon: menuIcons.assets, label: 'Asset Lineage', href: '/lineage' },
  { customIcon: menuIcons.glossary, label: 'Glossary View', href: '/glossary' },
  // { customIcon: menuIcons.typeExplorer, label: 'Type Explorer', href: '/type-explorer' },
  { customIcon: menuIcons.assetCatalog, label: 'Asset Catalog', href: '/assets/catalog' },
  /* {
    customIcon: menuIcons.repositoryExplorer,
    label: 'Repository Explorer',
    href: '/repository-explorer'
  } */
];

export default function AppInstance() {
  return (
    <EgeriaApp
      menu={menu}
      main={(
        <Routes>
          <Route path="/hi" element={<>Hi</>} />

          <Route path="/asset-lineage/:guid/:lineageType" element={<RequireAuth><EgeriaLineageGraphRouteWrapper /></RequireAuth>} />
          <Route path="/asset-lineage/:guid/:lineageType/print" element={<EgeriaLineageGraphPrint />} />
          <Route path="/assets/:guid/details" element={<RequireAuth><EgeriaAssetDetails /></RequireAuth>} />
          <Route path="/assets/catalog" element={<RequireAuth><EgeriaAssetCatalog /></RequireAuth>} />
          <Route path="/glossary" element={<RequireAuth><EgeriaGlossary columnMinWidth={155} /></RequireAuth>} />

          <Route path="/about" element={<EgeriaAbout />} />
        </Routes>
 )}
    />
  );
}
