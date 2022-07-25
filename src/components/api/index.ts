export const apiUrl = () => {
  return `${process.env.REACT_APP_API_URL}`;
}

export function goHome() {
  console.log('WENT HOME');

  window.location.href='/';
};