if(process.version === 'v16.13.0') {
  process.exit(0);
} else {
  console.warn('============================================\n|     Please use NodeJS version v16.13.0   |\n============================================');
  console.warn('|          and use NPM version 8.1.0       |\n============================================\n');

  process.exit(1);
}