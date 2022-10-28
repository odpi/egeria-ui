import { EgeriaApp, RequireAuth, EgeriaAbout } from '@lfai/egeria-ui-core';

import {
  EgeriaAssetCatalog,
  EgeriaAssetDetails,
  EgeriaGlossary,
  EgeriaLineageGraphRouteWrapper
} from '@lfai/egeria-ui-components';

import { Routes, Route } from 'react-router-dom';
import { apiUrl, menuIcons } from '@lfai/egeria-js-commons';

const menu = [
  { customIcon: menuIcons.assets, label: 'Asset Lineage', href: '/lineage' },
  // { customIcon: menuIcons.glossary, label: 'Glossary View', href: '/glossary' },
  // { customIcon: menuIcons.typeExplorer, label: 'Type Explorer', href: '/type-explorer' },
  { customIcon: menuIcons.assetCatalog, label: 'Asset Catalog', href: '/assets/catalog' },
  // { customIcon: menuIcons.repositoryExplorer, label: 'Repository Explorer', href: '/repository-explorer' }
];

export function AppInstance() {
  return <>
    <EgeriaApp menu={menu} main={
      <Routes>
        <Route path="/hi" element={<>Hi</>} />

        <Route path={`/asset-lineage/:guid/:lineageType`} element={<RequireAuth><EgeriaLineageGraphRouteWrapper apiUrl={''} /></RequireAuth>} />
        <Route path={'/assets/:guid/details'} element={<RequireAuth><EgeriaAssetDetails apiUrl={''} /></RequireAuth>} />
        <Route path={'/assets/catalog'} element={<RequireAuth><EgeriaAssetCatalog apiUrl={''} /></RequireAuth>} />
        <Route path={"/glossary"} element={<RequireAuth><EgeriaGlossary /></RequireAuth>} />

        <Route path={"/about"} element={<EgeriaAbout apiUrl={`${apiUrl()}`} />} />
        </Routes> }
      />
  </>;
}
