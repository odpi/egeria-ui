import {
  ActionIcon,
  Container,
  Group,
  Header,
  TextInput,
  createStyles,
  useMantineTheme,
  MultiSelect,
  LoadingOverlay
} from '@mantine/core';

import {
  Search,
  ArrowRight,
  ArrowLeft,
  BrandGithub,
  BrandSlack,
  Logout,
  Login
} from 'tabler-icons-react';

import { FeaturesGrid } from '../Features';
import { NavLink } from 'react-router-dom';
import { types } from '../api/types';
import { useEffect, useState } from 'react';
import { currentJwt, logout } from 'egeria-ui-core';
import { goHome } from '../api';

const useStyles = createStyles((theme) => ({
  inner: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 56,

    [theme.fn.smallerThan('sm')]: {
      justifyContent: 'flex-start',
    },
  },

  links: {
    width: 260,

    [theme.fn.smallerThan('sm')]: {
      display: 'none',
    },
  },

  social: {
    width: 260,

    [theme.fn.smallerThan('sm')]: {
      width: 'auto',
      marginLeft: 'auto',
    },
  },

  burger: {
    marginRight: theme.spacing.md,

    [theme.fn.largerThan('sm')]: {
      display: 'none',
    },
  },

  link: {
    display: 'block',
    lineHeight: 1,
    padding: '8px 12px',
    borderRadius: theme.radius.sm,
    textDecoration: 'none',
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
    },
  },

  linkActive: {
    '&, &:hover': {
      backgroundColor:
        theme.colorScheme === 'dark'
          ? theme.fn.rgba(theme.colors[theme.primaryColor][9], 0.25)
          : theme.colors[theme.primaryColor][0],
      color: theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 3 : 7],
    },
  },
}));

export const links = [
  {
    "link": "/",
    "label": "Home"
  },
  {
    "link": "/assets/catalog",
    "label": "Catalog"
  },
  {
    "link": "/about",
    "label": "About"
  }
];

interface HeaderMiddleProps {
  links: { link: string; label: string }[];
}

export function Home({ links }: HeaderMiddleProps) {
  const theme = useMantineTheme();
  const { classes} = useStyles();
  const isLoggedIn = currentJwt();
  const [typesData, setTypesData] = useState([]);

  useEffect(() => {
    types.getAll().then(response => response.json()).then(data => {
      setTypesData(data.map((d: any) => {
        return {
          value: d.name,
          label: d.name
        }
      }));
    });
  }, [])

  const items = links.map((link, index) => (
    <NavLink className={classes.link} to={link.link} key={index}>{link.label}</NavLink>
  ));

  return (<>
    <Header height={56} mb={15}>
      <Container className={classes.inner}>
        <Group className={classes.links} spacing={5}>
          {items}
        </Group>

        <img src="/egeria-logo.svg" alt="Egeria" title="Egeria" style={{height:40}}/>

        <Group spacing={0} className={classes.social} position="right" noWrap>
          <ActionIcon size="lg"
                      title="Github"
                      onClick={() => { window.open('https://github.com/odpi', '_blank'); }}>
            <BrandGithub size={18} />
          </ActionIcon>
          <ActionIcon size="lg"
                      title="Slack"
                      onClick={() => { window.open('https://lfaifoundation.slack.com', '_blank'); }}>
            <BrandSlack size={18} />
          </ActionIcon>

          { isLoggedIn && <ActionIcon size="lg" title={'Logout'} onClick={() => { logout(goHome); }}>
                            <Logout size={18} />
                          </ActionIcon> }

          { !isLoggedIn && <NavLink to={`/login`}>
                            <ActionIcon size="lg" title={`Login`}>
                              <Login size={18} />
                            </ActionIcon>
                          </NavLink> }
        </Group>
      </Container>
    </Header>

    <Container mt={70} style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between'}}>
      <MultiSelect
        data={typesData}
        radius="xl"
        size="md"
        placeholder="Type"
        style={{width:'30%'}}
      />
      <TextInput
        style={{width:'69%'}}
        icon={<Search size={18} />}
        radius="xl"
        size="md"
        rightSection={
          <ActionIcon size={32} radius="xl" color={theme.primaryColor} variant="filled">
            {theme.dir === 'ltr' ? <ArrowRight size={18} /> : <ArrowLeft size={18} />}
          </ActionIcon>
        }
        placeholder="Search terms"
        rightSectionWidth={42}
      />
    </Container>

    <FeaturesGrid />

    <LoadingOverlay visible={!typesData.length} />
  </>);
}
