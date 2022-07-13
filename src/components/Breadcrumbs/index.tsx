import { Breadcrumbs, Anchor } from '@mantine/core';

export function EgeriaBreadcrumbs(props: any) {
  const { items } = props;

  return (
    <Breadcrumbs>{items}</Breadcrumbs>
  );
}