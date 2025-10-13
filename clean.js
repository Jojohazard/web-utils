import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const libDir = path.join('lib');

const packages = fs.readdirSync(libDir)
  .filter(name => fs.existsSync(path.join(libDir, name, 'package.json')))
  .map(name => {
    const pkgJsonPath = path.join(libDir, name, 'package.json');
    const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf-8'));
    return { name, path: path.join(libDir, name), pkgJson };
  });

const graph = new Map();

for (const pkg of packages) {
  const deps = Object.assign(
    {},
    pkg.pkgJson.dependencies,
    pkg.pkgJson.devDependencies,
    pkg.pkgJson.peerDependencies
  );

  const localDeps = Object.keys(deps || {}).filter(dep =>
    packages.some(p => p.name === dep)
  );

  graph.set(pkg.name, localDeps);
}

function topoSort(graph) {
  const visited = new Set();
  const temp = new Set();
  const result = [];

  function visit(node) {
    if (temp.has(node)) {
      throw new Error('Circular dependency detected: ' + node);
    }
    if (!visited.has(node)) {
      temp.add(node);
      (graph.get(node) || []).forEach(visit);
      temp.delete(node);
      visited.add(node);
      result.push(node);
    }
  }

  for (const node of graph.keys()) {
    visit(node);
  }

  return result;
}

const buildOrder = topoSort(graph);

// For cleaning, you probably want to clean in **reverse order** — 
// i.e. clean dependents before dependencies to avoid leftover files
const cleanOrder = buildOrder.slice().reverse();

for (const pkgName of cleanOrder) {
  const pkg = packages.find(p => p.name === pkgName);
  if (!pkg) continue;

  console.log(`Cleaning ${pkgName}...`);
  
  try {
    execSync('npm run clean', { cwd: pkg.path, stdio: 'inherit' });
  } catch (e) {
    console.error(`Clean failed for ${pkgName}`, e);
    process.exit(1);
  }
}
