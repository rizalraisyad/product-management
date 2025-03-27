const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const { execSync } = require('child_process');

const argv = yargs(hideBin(process.argv)).argv;
const [name] = argv._;

if (!name) {
  console.error('❌ Please provide a migration name.');
  console.error('Usage: yarn migration:gen YourMigrationName');
  process.exit(1);
}

try {
  execSync(
    `npx ts-node -P ./tsconfig.json -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:generate ./src/db/migrations/${name} -d ./src/config/datasource.ts`,
    { stdio: 'inherit' }
  );  
} catch (err) {
  console.error('❌ Migration generation failed:', err.message);
  process.exit(1);
}
