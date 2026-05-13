#!/usr/bin/env node
/**
 * HTML Build Validation Script
 * Validates the 911cyber-v2-FULL.html file for deployment
 */

const fs = require('fs');
const path = require('path');

const HTML_FILE = path.join(__dirname, '../911cyber-v2-FULL.html');

console.log('🔍 Starting HTML validation...\n');

try {
  // Read the HTML file
  const content = fs.readFileSync(HTML_FILE, 'utf8');

  // Array of validation checks
  const placeholders = [
    'YOUR_PIXEL_ID',
    'AW-CONVERSION_ID',
    'AW-CONVERSION_LABEL',
    'YOUR_FORM_ID',
    '234XXXXXXXXXX',
    'YOUR_TAWKTO_ID',
    'YOUR_TAWKTO_WIDGET',
  ];

  let errors = [];
  let warnings = [];

  // Check for unresolved placeholders
  console.log('📋 Checking for unresolved placeholders...');
  placeholders.forEach((placeholder) => {
    // Skip if it's in a comment
    const regex = new RegExp(placeholder, 'g');
    const matches = content.match(regex) || [];
    
    // Filter out placeholder matches in HTML comments that explain what to replace
    const lines = content.split('\n');
    const problematicMatches = [];
    
    lines.forEach((line, idx) => {
      if (line.includes(placeholder) && !line.includes('Replace') && !line.includes('REPLACE')) {
        const count = (line.match(regex) || []).length;
        if (count > 0) {
          problematicMatches.push({ line: idx + 1, text: line.trim().substring(0, 60) });
        }
      }
    });

    if (problematicMatches.length > 0) {
      warnings.push(`  ⚠ "${placeholder}" found ${problematicMatches.length} times`);
      problematicMatches.forEach((m) => {
        warnings.push(`    Line ${m.line}: ${m.text}...`);
      });
    }
  });

  if (warnings.length === 0) {
    console.log('  ✅ No placeholder values detected\n');
  } else {
    warnings.forEach(w => console.log(w));
    console.log();
  }

  // Check for required configuration values
  console.log('🔧 Checking for required configuration values...');
  const requiredValues = [
    { key: 'Meta Pixel ID', pattern: 'fbq\\(\'init\',\'\\d+\'' },
    { key: 'Google Ads ID', pattern: 'AW-\\d+' },
    { key: 'Formspree Form ID', pattern: 'formspree\\.io/f/[a-z0-9]+' },
    { key: 'WhatsApp Number', pattern: 'wa\\.me/\\d+' },
    { key: 'Tawk.to Widget', pattern: 'embed\\.tawk\\.to/[a-z0-9]+' },
  ];

  const found = [];
  requiredValues.forEach((item) => {
    if (new RegExp(item.pattern).test(content)) {
      found.push(`  ✅ ${item.key}`);
    } else {
      errors.push(`  ❌ ${item.key} not found`);
    }
  });

  found.forEach(f => console.log(f));
  console.log();

  // Check HTML structure
  console.log('📐 Checking HTML structure...');
  const divOpen = (content.match(/<div(?:\s|>)/g) || []).length;
  const divClose = (content.match(/<\/div>/g) || []).length;
  const scriptOpen = (content.match(/<script(?:\s|>)/g) || []).length;
  const scriptClose = (content.match(/<\/script>/g) || []).length;

  if (divOpen === divClose) {
    console.log(`  ✅ Divs balanced: ${divOpen} open, ${divClose} closed`);
  } else {
    errors.push(`  ❌ Divs mismatch: ${divOpen} open, ${divClose} closed`);
  }

  if (scriptOpen === scriptClose) {
    console.log(`  ✅ Scripts balanced: ${scriptOpen} open, ${scriptClose} closed`);
  } else {
    errors.push(`  ❌ Scripts mismatch: ${scriptOpen} open, ${scriptClose} closed`);
  }

  console.log(`  ✅ File size: ${(content.length / 1024).toFixed(2)} KB\n`);

  // Final report
  console.log('=' .repeat(60));
  if (errors.length === 0) {
    console.log('✅ BUILD VALIDATION PASSED');
    console.log('File is ready for deployment to Vercel.');
    process.exit(0);
  } else {
    console.log('❌ BUILD VALIDATION FAILED');
    console.log('\nErrors:');
    errors.forEach(e => console.log(e));
    process.exit(1);
  }
} catch (error) {
  console.error('❌ Error during validation:', error.message);
  process.exit(1);
}
