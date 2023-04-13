import { Routes, Route } from 'react-router-dom';

import {
  EgeriaAbout,
  EgeriaApp,
  EgeriaHome,
  EgeriaLogin,
  EgeriaPageNotFound,
  RequireAuth,
  RequirePermissions,
  links
} from '@lfai/egeria-ui-core';

import {
  EgeriaAssetCatalog,
  EgeriaAssetDetails,
  EgeriaAssetDetailsPrint,
  EgeriaGlossary,
  EgeriaLineageGraphPrint,
  EgeriaLineageGraphRouteWrapper
} from '@lfai/egeria-ui-components';

import {
  eNavigateTo,
  menuIcons,
  VISIBLE_COMPONENTS
} from '@lfai/egeria-js-commons';

const menu = [
  {customIcon: menuIcons.assets, label: 'Asset Lineage', href: '/lineage', component: VISIBLE_COMPONENTS.ASSET_LINEAGE},
  {customIcon: menuIcons.glossary, label: 'Glossary View', href: '/glossary', component: VISIBLE_COMPONENTS.GLOSSARY},
  // {customIcon: menuIcons.typeExplorer, label: 'Type Explorer', href: '/type-explorer', component: VISIBLE_COMPONENTS.TYPE_EXPLORER},
  {customIcon: menuIcons.assetCatalog, label: 'Asset Catalog', href: '/assets/catalog', component: VISIBLE_COMPONENTS.ASSET_CATALOG},
  // {customIcon: menuIcons.repositoryExplorer, label: 'Repository Explorer', href: '/repository-explorer', component: VISIBLE_COMPONENTS.REPOSITORY_EXPLORER}
];

export function AppInstance() {
  return <>
    <Routes>
      <Route path='/' element={<EgeriaApp single={true} main={
        <EgeriaHome links={links} />
      } /> } />

      <Route path={'/about'} element={
        <EgeriaApp menu={menu} main={<RequireAuth>
          <RequirePermissions component={VISIBLE_COMPONENTS.ABOUT}
                              showAccessDenied={true}
                              element={<EgeriaAbout />}/>
        </RequireAuth>} />
      } />

      <Route path='/login' element={<EgeriaApp single={true} main={
        <EgeriaLogin loginCallback={ () => eNavigateTo('/') } />
      } /> } />

      <Route path={'/asset-lineage/:guid/vertical-lineage'} element={
        <EgeriaApp menu={menu} main={<RequireAuth>
          <RequirePermissions component={VISIBLE_COMPONENTS.VERTICAL_LINEAGE}
                              showAccessDenied={true}
                              element={<EgeriaLineageGraphRouteWrapper />}/>
        </RequireAuth>} />
      } />

      <Route path={'/asset-lineage/:guid/end-to-end'} element={
        <EgeriaApp menu={menu} main={<RequireAuth>
          <RequirePermissions component={VISIBLE_COMPONENTS.END_TO_END}
                              showAccessDenied={true}
                              element={<EgeriaLineageGraphRouteWrapper />}/>
        </RequireAuth>} />
      } />

      <Route path={'/asset-lineage/:guid/ultimate-source'} element={
        <EgeriaApp menu={menu} main={<RequireAuth>
          <RequirePermissions component={VISIBLE_COMPONENTS.ULTIMATE_SOURCE}
                              showAccessDenied={true}
                              element={<EgeriaLineageGraphRouteWrapper />}/>
        </RequireAuth>} />
      } />

      <Route path={'/asset-lineage/:guid/ultimate-destination'} element={
        <EgeriaApp menu={menu} main={<RequireAuth>
          <RequirePermissions component={VISIBLE_COMPONENTS.ULTIMATE_DESTINATION}
                              showAccessDenied={true}
                              element={<EgeriaLineageGraphRouteWrapper />}/>
        </RequireAuth>} />
      } />

      <Route path={'/asset-lineage/:guid/:lineageType/print'} element={
        <EgeriaApp single={true} main={<RequireAuth>
          <RequirePermissions component={ VISIBLE_COMPONENTS.ASSET_LINEAGE_PRINT}
                              showAccessDenied={true}
                              element={<EgeriaLineageGraphPrint />} />
        </RequireAuth>} />
      } />

      <Route path={'/assets/:guid/details'} element={
        <EgeriaApp menu={menu} main={<RequireAuth>
          <RequirePermissions component={VISIBLE_COMPONENTS.ASSET_DETAILS}
                              showAccessDenied={true}
                              element={<EgeriaAssetDetails />}/>
        </RequireAuth>} />
      } />

      <Route path={'/assets/:guid/details/print'} element={
        <EgeriaApp single={true} main={<RequireAuth>
          <RequirePermissions component={ VISIBLE_COMPONENTS.ASSETS_DETAILS_PRINT}
                              showAccessDenied={true}
                              element={<EgeriaAssetDetailsPrint />} />
        </RequireAuth>} />
      } />

      <Route path={'/assets/catalog'} element={
        <EgeriaApp menu={menu} main={<RequireAuth>
          <RequirePermissions component={VISIBLE_COMPONENTS.ASSET_CATALOG}
                              showAccessDenied={true}
                              element={<EgeriaAssetCatalog />}/>
        </RequireAuth>} />
      } />

      <Route path={'/glossary'} element={
        <EgeriaApp menu={menu} main={<RequireAuth>
          <RequirePermissions component={VISIBLE_COMPONENTS.GLOSSARY}
                              showAccessDenied={true}
                              element={<EgeriaGlossary columnMinWidth={155}/>}/>
        </RequireAuth>} />
      } />

      <Route path='/*' element={<EgeriaApp single={true} main={
        <EgeriaPageNotFound />} />
      } />
    </Routes>
  </>;
}
