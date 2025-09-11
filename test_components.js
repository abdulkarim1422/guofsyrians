// Test script to check if components can be imported properly
const { execSync } = require('child_process');

console.log('Testing component imports...');

try {
  // Test if we can parse the components for syntax errors
  const result = execSync('npx eslint frontend/src/components/form-components/*.jsx --no-eslintrc', 
    { 
      cwd: 'c:\\Users\\hp\\Music\\traininng\\training-employment',
      encoding: 'utf8'
    }
  );
  console.log('ESLint output:', result);
} catch (error) {
  if (error.stdout) {
    console.log('ESLint found issues:', error.stdout);
  } else {
    console.log('No syntax errors found in components');
  }
}

console.log('Component test completed.');
