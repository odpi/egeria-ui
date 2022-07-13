import { Navbar, Tooltip, UnstyledButton, createStyles, Group } from '@mantine/core';
import {
  Icon as TablerIcon,
  Logout,
  InfoCircle,
  UserCircle
} from 'tabler-icons-react';
import { NavLink } from 'react-router-dom';
import { authenticationService } from '../../services/authentication.service';

const IconAssets = () => <svg height="28px" viewBox="0 0 203 193" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="30" cy="163" r="30" fill="#1ABB9B"/><circle cx="170" cy="133" r="30" stroke="#2C3E50" strokeWidth="5"/><circle cx="170" cy="30" r="30" fill="#2C3E50"/><line x1="58.9889" y1="131.892" x2="138.989" y2="58.892" stroke="black" strokeWidth="3"/><line x1="168.5" y1="96" x2="168.5" y2="69" stroke="black" strokeWidth="3"/></svg>;
const IconGlossary = () => <svg height="33px" viewBox="0 0 140 187" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.02032 22.4176C2.46496 10.2123 13.4332 4.38697 18.9868 3H137V14.0958H130.058M3.02032 22.4176C3.57567 34.623 13.896 39.0613 18.9868 39.7548H137M3.02032 22.4176C3.02032 64.7203 3.02032 152.793 3.02032 166.663C3.02032 180.533 13.6646 184 18.9868 184H137V39.7548M137 39.7548V29.3525H130.058M25.9288 14.0958H130.058M34.2591 29.3525H130.058M130.058 14.0958V29.3525M73.8282 59.8659H116.868M73.8282 73.7356H116.868M116.868 87.6054H73.8282M73.8282 101.475H116.868M75.9108 125.747H114.071L78.2958 167.356H119.253M16.9042 104.249L25.0032 84.8314M59.2501 104.249L50.8812 84.8314M25.0032 84.8314L37.7301 54.318L50.8812 84.8314M25.0032 84.8314H50.8812M16.9042 125.747H59.2501M59.2501 139.617H16.9042M16.9042 153.487H59.2501M16.9042 167.356H59.2501" stroke="#2C3E50" strokeWidth="5"/></svg>;
const IconTypeExplorer = () => <svg height="22px" viewBox="0 0 237 156" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M113.073 15H227V146H54V120.582" stroke="#1ABB9B" strokeWidth="20"/><path d="M73.7696 111C58.2565 109.517 42.7435 109.517 27.2304 111C26.9003 110.506 26.7353 109.517 26.7353 108.033C26.7353 106.55 26.9003 105.479 27.2304 104.82C30.6961 104.82 33.2541 104.49 34.9044 103.831C36.5547 103.007 37.4624 102.347 37.6275 101.853C38.4526 100.205 38.8652 98.1448 38.8652 95.6726C39.0302 93.2004 39.1127 90.1514 39.1127 86.5256V10.1359H23.7647C19.6389 10.1359 15.8431 12.2784 12.3775 16.5635C9.0768 20.8486 7.09641 25.6281 6.43628 30.902C6.10621 31.3964 5.52859 31.6437 4.70343 31.6437C2.39297 31.6437 0.825163 31.2316 0 30.4076L4.45588 0.494429C4.78595 0.329623 4.95098 0.24722 4.95098 0.24722C5.11601 0.0824067 5.52859 0 6.18873 0C7.01389 0 7.83905 0.16481 8.66422 0.494429C9.48938 0.824049 10.4796 1.15367 11.6348 1.4833C15.1005 2.47216 18.9788 2.96659 23.2696 2.96659H77.4828C83.5891 2.96659 88.4575 2.14253 92.0882 0.494429C92.9134 0.16481 93.6561 0 94.3162 0C95.1413 0 95.884 0.16481 96.5441 0.494429L101 30.4076C100.175 31.2316 98.9371 31.6437 97.2868 31.6437C95.6364 31.6437 94.7288 31.3964 94.5637 30.902C93.5735 25.2984 91.8407 21.0134 89.3652 18.0468C85.2394 12.7728 81.1136 10.1359 76.9877 10.1359H61.8873V86.5256C61.8873 94.7661 62.2998 99.8753 63.125 101.853C63.7851 103.831 67.3333 104.82 73.7696 104.82C74.0997 105.479 74.2647 106.55 74.2647 108.033C74.2647 109.517 74.0997 110.506 73.7696 111Z" fill="#2C3E50"/></svg>;
const IconAssetCatalog = () => <svg height="28px" viewBox="0 0 178 155" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M114.5 71C113.395 71 112.5 70.1046 112.5 69V29.5C112.5 28.3954 113.395 27.5 114.5 27.5H153.5C154.605 27.5 155.5 28.3954 155.5 29.5V69C155.5 70.1046 154.605 71 153.5 71H114.5Z" fill="#2C3E50"/><path d="M59 128.5C57.8954 128.5 57 127.605 57 126.5V87C57 85.8954 57.8954 85 59 85H98C99.1046 85 100 85.8954 100 87V126.5C100 127.605 99.1046 128.5 98 128.5H59Z" fill="#2C3E50"/><path d="M114.5 128.5C113.395 128.5 112.5 127.605 112.5 126.5V87C112.5 85.8954 113.395 85 114.5 85H153.5C154.605 85 155.5 85.8954 155.5 87V126.5C155.5 127.605 154.605 128.5 153.5 128.5H114.5Z" fill="#2C3E50"/><path d="M17 139V149.5C17 150.605 17.8954 151.5 19 151.5H172C173.105 151.5 174 150.605 174 149.5V6C174 4.89543 173.105 4 172 4H19C17.8954 4 17 4.89543 17 6V17.5M17 107V48.5M0 33H37.5M0 123H37.5M155.5 87V126.5C155.5 127.605 154.605 128.5 153.5 128.5H114.5C113.395 128.5 112.5 127.605 112.5 126.5V87C112.5 85.8954 113.395 85 114.5 85H153.5C154.605 85 155.5 85.8954 155.5 87ZM98 128.5H59C57.8954 128.5 57 127.605 57 126.5V87C57 85.8954 57.8954 85 59 85H98C99.1046 85 100 85.8954 100 87V126.5C100 127.605 99.1046 128.5 98 128.5ZM155.5 29.5V69C155.5 70.1046 154.605 71 153.5 71H114.5C113.395 71 112.5 70.1046 112.5 69V29.5C112.5 28.3954 113.395 27.5 114.5 27.5H153.5C154.605 27.5 155.5 28.3954 155.5 29.5ZM100 29.5V69C100 70.1046 99.1046 71 98 71H59C57.8954 71 57 70.1046 57 69V29.5C57 28.3954 57.8954 27.5 59 27.5H98C99.1046 27.5 100 28.3954 100 29.5Z" stroke="#2C3E50" strokeWidth="7"/></svg>;
const IconRepositoryExplorer = () => <svg height="33px" viewBox="0 0 150 171" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.00183 36.6933C5.00183 -6.34931 145 -4.77221 145 36.6933M5.00183 36.6933C5.00065 78.8341 145 81.313 145 36.6933M5.00183 36.6933C5.00183 50.773 5.00139 62.0824 5.00094 72.2989M145 36.6933C145 50.7117 145 61.9689 145 72.2989M5.00094 72.2989C5.00024 114.665 145 115.342 145 72.2989M5.00094 72.2989C5.00046 83.1531 4.99998 92.7737 5 103.172M145 72.2989C145 82.906 145 92.5354 145 103.172M5 103.172C5.00002 112.908 5.00049 123.325 5.00183 136.075C5.00593 175.261 144.999 176.683 145 136.075C145 123.292 145 112.818 145 103.172M5 103.172C5 145.539 145 143.961 145 103.172" stroke="#2C3E50" strokeWidth="10"/></svg>;


const useStyles = createStyles((theme) => ({
  link: {
    width: 50,
    height: 50,
    borderRadius: theme.radius.md,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[0],
    },
  },

  active: {
    '&, &:hover': {
      backgroundColor:
        theme.colorScheme === 'dark'
          ? theme.fn.rgba(theme.colors[theme.primaryColor][9], 0.25)
          : theme.colors[theme.primaryColor][0],
      color: theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 4 : 7],
    },
  },
}));

interface NavbarLinkProps {
  icon: TablerIcon;
  href?: string;
  label: string;
  active?: boolean;
  onClick?(): void;
}

function NavbarLink({ icon: Icon, label, href, active = false, onClick }: NavbarLinkProps) {
  const { classes, cx } = useStyles();
  return (
    <Tooltip label={label} position="right" withArrow transitionDuration={0}>
      <UnstyledButton onClick={onClick} className={cx(classes.link, { [classes.active]: active })}>
        <NavLink style={{color: 'inherit'}} to={href || '#'}><Icon /></NavLink>
      </UnstyledButton>
    </Tooltip>
  );
}

const menu = [
  { icon: IconAssets, label: 'Asset Lineage', href: '/lineage' },
  { icon: IconGlossary, label: 'Glossary View', href: '/glossary' },
  { icon: IconTypeExplorer, label: 'Type Explorer', href: '/type-explorer' },
  { icon: IconAssetCatalog, label: 'Asset Catalog', href: '/assets/catalog' },
  { icon: IconRepositoryExplorer, label: 'Repository Explorer', href: '/repository-explorer' }
];

export function EgeriaNavbar() {
  const links = menu.map((link, index) => (
    <NavbarLink
      {...link}
      href={link.href}
      key={link.label}
    />
  ));

  const handleLogout = () => {
    authenticationService.logout();
  };

  return (
    <Navbar p="md" width={{ base: 80, sm: 80, lg: 80 }}>
      <Navbar.Section grow>
        <Group direction="column" align="center">
          {links}
        </Group>
      </Navbar.Section>

      <Navbar.Section>
        <Group direction="column" align="center">
          <NavbarLink icon={UserCircle} label="Profile" href="/profile" />
        </Group>
        <Group direction="column" align="center">
          <NavbarLink icon={InfoCircle} label="About" href="/about" />
        </Group>
        <Group direction="column" align="center">
          <NavbarLink icon={Logout} label="Logout" onClick={() => handleLogout()}/>
        </Group>
      </Navbar.Section>
    </Navbar>
  );
}