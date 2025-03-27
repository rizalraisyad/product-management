import yargs from 'yargs';
import { execSync } from 'child_process';

const {
  _: [name],
} = yargs.argv as { _: string[] };

if (!name) {
  console.error('❌ Please provide a migration name.');
  process.exit(1);
}

const migrationPath = `src/db/migrations/${name}`;

execSync(`yarn typeorm migration:generate ${migrationPath} --pretty`, {
  stdio: 'inherit',
});
