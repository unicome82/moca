// CSS custom properties resolve url() against the stylesheet that reads them,
// so relative paths must be made absolute against the document first.
export const assetUrl = (path) =>
  `url("${new URL(`${import.meta.env.BASE_URL}${path}`, document.baseURI).href}")`;
