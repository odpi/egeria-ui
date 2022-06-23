import {
  Anchor,
  AppShell,
  Container,
  Paper,
  useMantineTheme
} from '@mantine/core';

import {
  BrowserRouter as Router,
  NavLink,
  Route,
  Routes
} from 'react-router-dom';
import About from '../About';
import AssetCatalog from '../Assets/Catalog';
import AssetDetails from '../Assets/Details';

import { EgeriaHeader } from '../Header';
import Lineage from '../Lineage';
import LineageViewer from '../Lineage/Viewer';
import { EgeriaNavbar } from '../NavbarMinimal';
// import { EgeriaBreadcrumbs } from '../Breadcrumbs';

export function App() {
  const theme = useMantineTheme();

  // const items = [
  //   { title: 'Assets', href: '#' },
  //   { title: 'Details', href: '#' },
  // ].map((item: any, index) => (
  //   <Anchor href={item.href} key={index}>
  //     {item.title}
  //   </Anchor>
  // ));

  return <>
    <AppShell
      styles={{
        main: {
          background: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
          paddingTop: `calc(var(--mantine-header-height, 0px))`,
          paddingBottom: `calc(var(--mantine-footer-height, 0px))`,
          paddingLeft: `calc(var(--mantine-navbar-width, 0px))`,
          paddingRight: `calc(var(--mantine-aside-width, 0px))`,
        }
      }}
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      fixed
      navbar={<EgeriaNavbar />}
      header={<EgeriaHeader />}
    >

      {/* <Container fluid>
        <EgeriaBreadcrumbs items={items} />
      </Container> */}

      <div style={{height:'100%', width:'100%'}}>
        <Routes>
          <Route path="/hi" element={<>Hi</>} />

          <Route path={"/about"} element={<About />} />

          <Route path={"/assets/:uuid/details"} element={<AssetDetails match={""} />} />

          <Route path={"/assets/catalog"} element={<AssetCatalog location={""}/>} />

          <Route path={"/lineage"} element={<Lineage />} />

          <Route path={"/lineage/viewer"} element={<LineageViewer />} />
        </Routes>
      </div>
    </AppShell>
  </>;
}
