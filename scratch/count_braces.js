const fs = require('fs');
const content = fs.readFileSync('client/src/pages/NutritionTracker.jsx', 'utf8');
const openBraces = (content.match(/\{/g) || []).length;
const closeBraces = (content.match(/\}/g) || []).length;
const openParens = (content.match(/\(/g) || []).length;
const closeParens = (content.match(/\)/g) || []).length;
console.log(`Braces - Open: ${openBraces}, Close: ${closeBraces}`);
console.log(`Parens - Open: ${openParens}, Close: ${closeParens}`);
