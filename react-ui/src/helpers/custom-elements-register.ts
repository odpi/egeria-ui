const customElementsRegister = (name: string, klass: any) => {
  const myElementExists = !!customElements.get(name);

  if(!myElementExists) {
    customElements.define('egeria-about-lit', klass);
  }
}

export {
  customElementsRegister
};