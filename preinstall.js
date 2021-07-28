if(process.version === 'v10.13.0') {
  process.exit(0);
} else {
  console.warn('============================================\n|     Please use NodeJS version v10.13.0   |\n============================================');
  console.warn('|          and use NPM version 6.4.1       |\n============================================\n');

  process.exit(1);
}