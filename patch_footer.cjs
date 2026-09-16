const fs = require('fs');
let code = fs.readFileSync('src/components/public/Footer.tsx', 'utf-8');

// Find and remove the Journal link
const linkText = `                <button
                  onClick={() => onNavigate('/journal')}
                  className="text-xs text-[#73716B] hover:text-[#A89472] transition-colors uppercase tracking-wider"
                >
                  The Estate Journal
                </button>`;
code = code.replace(linkText, '');

fs.writeFileSync('src/components/public/Footer.tsx', code);
