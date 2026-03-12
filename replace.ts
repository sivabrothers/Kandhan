import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf-8');

content = content.replace(/maroon-900/g, 'primary-900');
content = content.replace(/maroon-800/g, 'primary-800');
content = content.replace(/maroon-700/g, 'primary-700');
content = content.replace(/maroon-600/g, 'primary-600');
content = content.replace(/maroon-50/g, 'primary-50');
content = content.replace(/gold-600/g, 'accent-600');
content = content.replace(/gold-500/g, 'accent-500');
content = content.replace(/gold-400/g, 'accent-400');
content = content.replace(/cream-50/g, 'bg-50');
content = content.replace(/cream-100/g, 'bg-100');

// Update texts
content = content.replace(/KANDHAN KUDIL/g, 'கந்தன் குடில்');
content = content.replace(/Matrimony Services/g, 'செங்குந்தர் திருமண ஜாதக பரிவர்த்தனை மையம்');
content = content.replace(/Kandhan Kudil Matrimony/g, 'கந்தன் குடில் செங்குந்தர் திருமண ஜாதக பரிவர்த்தனை மையம்');
content = content.replace(/fjoke777@gmail\.com/g, 'kandhankudilmatrimony@gmail.com');
content = content.replace(/support@kandhankudil\.com/g, 'kandhankudilmatrimony@gmail.com');
content = content.replace(/\+91 98765 43210/g, '+91 97903 33735');

fs.writeFileSync('src/App.tsx', content);
console.log('Replacements done');
