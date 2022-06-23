import {
  Autocomplete,
  Center,
  Group,
  Header,
  createStyles
} from '@mantine/core';

import { Search } from 'tabler-icons-react';

const useStyles = createStyles((theme) => ({
  header: {
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
  },

  inner: {
    height: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  search: {
    width: 500,
    [theme.fn.smallerThan('sm')]: {
      width: 200,
    },
    [theme.fn.largerThan('md')]: {
      width: 800
    },
  },
}));

export function EgeriaHeader() {
  const { classes } = useStyles();

  return (
    <Header height={60} p="md" className={classes.header}>
      <div className={classes.inner}>
        <Group>
          <img src="/egeria-logo.svg" alt="Egeria" title="Egeria" style={{height:50}} />
        </Group>

        <Center style={{ width: '100%' }}>
          <Autocomplete
            placeholder="Search"
            className={classes.search}
            icon={<Search size={16} />}
            data={['React', 'Angular', 'Vue', 'Next.js', 'Riot.js', 'Svelte', 'Blitz.js']}
          />
        </Center>
      </div>
    </Header>
  );
}