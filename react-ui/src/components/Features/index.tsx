import React from 'react';
import {
  ThemeIcon,
  Text,
  Container,
  SimpleGrid,
  useMantineTheme,
  createStyles,
} from '@mantine/core';
import { Icon as TablerIcon } from 'tabler-icons-react';

import { MOCKDATA } from './mockdata';

interface FeatureProps {
  icon: TablerIcon;
  title: React.ReactNode;
  description: React.ReactNode;
}

export function Feature({ icon: Icon, title, description }: FeatureProps) {
  const theme = useMantineTheme();
  return (
    <div>
      <ThemeIcon variant="light" size={40} radius={40}>
        <Icon style={{ width: 20, height: 20 }} />
      </ThemeIcon>
      <Text style={{ marginTop: theme.spacing.sm, marginBottom: 7 }}>{title}</Text>
      <Text size="sm" color="dimmed" style={{ lineHeight: 1.6 }}>
        {description}
      </Text>
    </div>
  );
}

interface FeaturesGridProps {
  data?: FeatureProps[];
}

export function FeaturesGrid({ data = MOCKDATA }: FeaturesGridProps) {
  const theme = useMantineTheme();
  const features = data.map((feature, index) => <Feature {...feature} key={index} />);

  return (
    <Container>
      <SimpleGrid
        mt={60}
        cols={3}
        spacing={theme.spacing.xl * 2}
        breakpoints={[
          { maxWidth: 980, cols: 2, spacing: 'xl' },
          { maxWidth: 755, cols: 1, spacing: 'xl' },
        ]}
      >
        {features}
      </SimpleGrid>
    </Container>
  );
}