import * as fs from 'fs';
import * as path from 'path';
import * as glob from 'glob';

interface AngularConfig {
  projects: {
    [key: string]: {
      architect?: {
        build?: {
          options?: {
            assets?: Array<string | {
              glob: string;
              input: string;
              output: string;
            }>;
          };
        };
      };
    };
  };
}

// Function to find all component files
function findComponents(srcPath: string): string[] {
  return glob.sync(path.join(srcPath, '**/*.component.ts'));
}

// Function to find all service files
function findServices(srcPath: string): string[] {
  return glob.sync(path.join(srcPath, '**/*.service.ts'));
}

// Function to find all image files
function findImages(srcPath: string): string[] {
  return glob.sync(path.join(srcPath, '**/*.{svg,png,jpg,jpeg}'));
}

// Function to extract component name from file
function getComponentName(filePath: string): string {
  const content = fs.readFileSync(filePath, 'utf-8');
  const match = content.match(/@Component\({[\s\S]*?selector:\s*['"]([^'"]+)['"]/);
  return match ? match[1] : '';
}

// Function to extract service name from file
function getServiceName(filePath: string): string {
  const content = fs.readFileSync(filePath, 'utf-8');
  const className = content.match(/export\s+class\s+(\w+Service)/);
  return className ? className[1] : '';
}

// Function to check if component is used
function isComponentUsed(componentSelector: string, srcPath: string, componentPath: string): boolean {
  const allFiles = glob.sync(path.join(srcPath, '**/*.{html,ts}'));

  for (const file of allFiles) {
    if (file === componentPath) continue;

    const content = fs.readFileSync(file, 'utf-8');
    if (content.includes(componentSelector) || content.includes(path.basename(componentPath, '.ts'))) {
      return true;
    }
  }
  return false;
}

// Function to check if service is used
function isServiceUsed(serviceName: string, srcPath: string, servicePath: string): boolean {
  const allFiles = glob.sync(path.join(srcPath, '**/*.ts'));

  for (const file of allFiles) {
    if (file === servicePath) continue;

    const content = fs.readFileSync(file, 'utf-8');

    if (content.includes(serviceName)) {
      return true;
    }

    const injectionPattern = new RegExp(`(private|public|protected)\\s+\\w+\\s*:\\s*${serviceName}`);
    if (injectionPattern.test(content)) {
      return true;
    }
  }
  return false;
}

// Function to check if image is used
function isImageUsed(imagePath: string, srcPath: string): boolean {
  const allFiles = glob.sync(path.join(srcPath, '**/*.{html,ts,scss,css,json}'));
  const imageName = path.basename(imagePath);
  const imageNameWithoutExt = path.basename(imagePath, path.extname(imagePath));

  for (const file of allFiles) {
    const content = fs.readFileSync(file, 'utf-8');

    // Check for various ways images might be referenced
    if (
      content.includes(imageName) ||
      content.includes(imageNameWithoutExt) ||
      content.includes(imagePath.replace(/\\/g, '/')) ||
      content.includes(imagePath.replace(/\\/g, '\\\\'))
    ) {
      return true;
    }

    const patterns = [
      `src=['"](.*${imageName}['"])`,
      `url\\(['"](.*${imageName}['"]])\\)`,
      `background-image:[^;]*${imageName}`,
      `assets.*${imageName}`,
    ];

    for (const pattern of patterns) {
      if (new RegExp(pattern).test(content)) {
        return true;
      }
    }
  }

  // Check angular.json with proper typing
  try {
    const angularJsonPath = path.join(process.cwd(), 'angular.json');
    if (fs.existsSync(angularJsonPath)) {
      const angularJson = JSON.parse(fs.readFileSync(angularJsonPath, 'utf-8')) as AngularConfig;

      Object.values(angularJson.projects).forEach(project => {
        const assets = project?.architect?.build?.options?.assets || [];
        assets.forEach(asset => {
          if (typeof asset === 'string' && imagePath.includes(asset)) {
            return true;
          }
          if (typeof asset === 'object' && imagePath.includes(asset.glob)) {
            return true;
          }
        });
      });
    }
  } catch (error) {
    console.warn('Warning: Could not check angular.json for asset configuration');
  }

  return false;
}

// Main function to find unused code and assets
function findUnusedCode(srcPath: string) {
  console.log('Scanning for unused components, services, and images...');
  console.log('Source path:', srcPath);

  // Find components
  const components = findComponents(srcPath);
  console.log(`Found ${components.length} total components`);

  const unusedComponents: Array<{path: string, selector: string}> = [];
  const unusedServices: Array<{path: string, name: string}> = [];
  const unusedImages: Array<{path: string, type: string}> = [];

  // Check components
  components.forEach((componentPath, index) => {
    const selector = getComponentName(componentPath);
    if (selector && !isComponentUsed(selector, srcPath, componentPath)) {
      unusedComponents.push({
        path: componentPath,
        selector: selector
      });
    }

    if ((index + 1) % 10 === 0) {
      console.log(`Processed ${index + 1}/${components.length} components...`);
    }
  });

  // Find and check services
  const services = findServices(srcPath);
  console.log(`\nFound ${services.length} total services`);

  services.forEach((servicePath, index) => {
    const serviceName = getServiceName(servicePath);
    if (serviceName && !isServiceUsed(serviceName, srcPath, servicePath)) {
      unusedServices.push({
        path: servicePath,
        name: serviceName
      });
    }

    if ((index + 1) % 10 === 0) {
      console.log(`Processed ${index + 1}/${services.length} services...`);
    }
  });

  // Find and check images
  const images = findImages(srcPath);
  console.log(`\nFound ${images.length} total images`);

  images.forEach((imagePath, index) => {
    if (!isImageUsed(imagePath, srcPath)) {
      unusedImages.push({
        path: imagePath,
        type: path.extname(imagePath).slice(1).toUpperCase()
      });
    }

    if ((index + 1) % 10 === 0) {
      console.log(`Processed ${index + 1}/${images.length} images...`);
    }
  });

  return { unusedComponents, unusedServices, unusedImages };
}

// Get the source path from command line argument or use default
// @ts-ignore
const srcPath = process.argv[2] || './src/app';

// Run the analysis
// @ts-ignore
const { unusedComponents, unusedServices, unusedImages } = findUnusedCode(srcPath);

// Print results
console.log('\nResults:');
console.log('------------------------');

// Print unused components
console.log('\nUnused Components:');
if (unusedComponents.length === 0) {
  console.log('No unused components found!');
} else {
  console.log(`Found ${unusedComponents.length} unused components:`);
  unusedComponents.forEach(comp => {
    console.log(`\nSelector: ${comp.selector}`);
    console.log(`File: ${comp.path}`);
  });
}

// Print unused services
console.log('\nUnused Services:');
if (unusedServices.length === 0) {
  console.log('No unused services found!');
} else {
  console.log(`Found ${unusedServices.length} unused services:`);
  unusedServices.forEach(service => {
    console.log(`\nService: ${service.name}`);
    console.log(`File: ${service.path}`);
  });
}

// Print unused images
console.log('\nUnused Images:');
if (unusedImages.length === 0) {
  console.log('No unused images found!');
} else {
  console.log(`Found ${unusedImages.length} unused images:`);
  unusedImages.forEach(image => {
    console.log(`\nFile: ${image.path}`);
    console.log(`Type: ${image.type}`);
  });
}
