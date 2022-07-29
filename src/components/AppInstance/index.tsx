import { EgeriaApp, RequireAuth, EgeriaAbout } from 'egeria-ui-core';
import { EgeriaGlossary, EgeriaLineage } from 'egeria-ui-components';
import { Routes, Route } from 'react-router-dom';

export function AppInstance() {
  return <>
    <EgeriaApp main={
      <Routes>
          <Route path="/hi" element={<>Hi</>} />

          <Route path={"/about"} element={<EgeriaAbout />} />

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
