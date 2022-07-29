import { EgeriaApp, RequireAuth, EgeriaAbout } from 'egeria-ui-core';
import { EgeriaGlossary, EgeriaLineage } from 'egeria-ui-components';
import { Routes, Route } from 'react-router-dom';
import { apiUrl, menuIcons } from 'egeria-js-commons';

const menu = [
  { customIcon: menuIcons.assets, label: 'Asset Lineage', href: '/lineage' },
  { customIcon: menuIcons.glossary, label: 'Glossary View', href: '/glossary' },
  { customIcon: menuIcons.typeExplorer, label: 'Type Explorer', href: '/type-explorer' },
  { customIcon: menuIcons.assetCatalog, label: 'Asset Catalog', href: '/assets/catalog' },
  { customIcon: menuIcons.repositoryExplorer, label: 'Repository Explorer', href: '/repository-explorer' }
];

export function AppInstance() {
  return <>
    <EgeriaApp menu={menu} main={
      <Routes>
          <Route path="/hi" element={<>Hi</>} />

          <Route path={"/about"} element={<EgeriaAbout apiUrl={`${apiUrl()}`} />} />

          {/* <Route path={"/assets/:uuid/details"}
                  element={<RequireAuth><AssetDetails match={""} /></RequireAuth>} /> */}


          <Route path={"/glossary"}
                 element={<RequireAuth><EgeriaGlossary /></RequireAuth>} />

          {/* <Route path={"/assets/catalog"}
                  element={<RequireAuth><AssetCatalog location={""}/></RequireAuth>} /> */}

          <Route path={"/lineage"}
                  element={<RequireAuth><EgeriaLineage lineage={'ultimate-source'} /></RequireAuth>} />

          {/* <Route path={"/lineage/viewer"}
                  element={<RequireAuth><LineageViewer /></RequireAuth>} /> */}
        </Routes> }
      />
  </>;
}
