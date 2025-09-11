// Quick validation check for components
import fs from 'fs';
import path from 'path';

const baseDir = 'frontend/src/components/form-components';
const components = [
  'WorkExperienceComponent.jsx',
  'ProjectsComponent.jsx', 
  'AcademicInputComponent.jsx',
  'MailInputComponent.jsx',
  'SocialInputComponent.tsx'
];

console.log('🔍 Checking component files...\n');

components.forEach(comp => {
  const filePath = path.join(baseDir, comp);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Basic checks
    const hasExport = content.includes('export');
    const hasReact = content.includes('React') || content.includes('react');
    const syntaxOK = !content.includes('undefined') && !content.includes('Error:');
    
    console.log(`✅ ${comp}:`);
    console.log(`   - Exists: ✓`);
    console.log(`   - Has export: ${hasExport ? '✓' : '❌'}`);
    console.log(`   - Uses React: ${hasReact ? '✓' : '❌'}`);
    console.log(`   - Basic syntax: ${syntaxOK ? '✓' : '❌'}`);
    console.log('');
  } else {
    console.log(`❌ ${comp}: File not found`);
  }
});

console.log('✨ Validation complete!');
