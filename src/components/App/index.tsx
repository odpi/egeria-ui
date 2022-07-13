import {
  AppShell,
  useMantineTheme
} from '@mantine/core';

import {
  // NavLink,
  Route,
  Routes
} from 'react-router-dom';
import About from '../About';
// import AssetCatalog from '../Assets/Catalog';
// import AssetDetails from '../Assets/Details';
import { EgeriaGlossary } from '../Glossary';

import { EgeriaHeader } from '../Header';
// import Lineage from '../Lineage';
// import LineageViewer from '../Lineage/Viewer';
import { EgeriaNavbar } from '../NavbarMinimal';
import { RequireAuth } from '../RequireAuth';

import { EgeriaLineage } from 'egeria-ui-components';
import LineageViewer from '../Lineage/Viewer';

export function App() {
  const theme = useMantineTheme();

  return <>
    <AppShell
      styles={{
        main: {
          background: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0]
        }
      }}
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      fixed
      navbar={<EgeriaNavbar />}
      header={<EgeriaHeader />}
    >
      <div style={{width:'100%', height:'100%'}}>
        <Routes>
          <Route path="/hi" element={<>Hi</>} />

          <Route path={"/about"} element={<About />} />

          {/* <Route path={"/assets/:uuid/details"}
                  element={<RequireAuth><AssetDetails match={""} /></RequireAuth>} /> */}


          <Route path={"/glossary"}
                 element={<RequireAuth><EgeriaGlossary /></RequireAuth>} />

          {/* <Route path={"/assets/catalog"}
                  element={<RequireAuth><AssetCatalog location={""}/></RequireAuth>} /> */}

          <Route path={"/lineage"}
                  element={<RequireAuth><EgeriaLineage lineage={'ultimate-source'} /></RequireAuth>} />

          <Route path={"/lineage/viewer"}
                  element={<RequireAuth><LineageViewer /></RequireAuth>} />
        </Routes>
      </div>
    </AppShell>
  </>;
}
