/**
 *
 * Used for checking if a web component html tag has been declared. It makes
 * sure that it is registered only once.
 *
 * @since      0.1.0
 * @access     public
 *
 * @param {string}  var Web component html tag name.
 * @param {class}   var Web component class.
 *
 *
 * @return {void} Returns undefined.
 *
 */
const customElementsRegister = (name: string, klass: any) => {
  const myElementExists = !!customElements.get(name);

  if(!myElementExists) {
    customElements.define('egeria-about-lit', klass);
  }
}

export {
  customElementsRegister
};