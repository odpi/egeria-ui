export const updateBreadcrumb = (crumbs) => {
  let evt = new CustomEvent('egeria-update-breadcrumb', {
    detail: {
      breadcrumbs: [
        ...crumbs
      ]
    },
    bubbles: true,
    composed: true
  });

  window.dispatchEvent(evt);
}