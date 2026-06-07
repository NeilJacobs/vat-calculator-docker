const fs = require('fs');
const path = require('path');
const filename = path.join(__dirname, 'audit.json');
let buf = fs.readFileSync(filename);
let text;
if (buf[0] === 0xff && buf[1] === 0xfe) {
  text = buf.toString('utf16le');
} else {
  text = buf.toString('utf8');
}
text = text.replace(/^\uFEFF/, '');
const data = JSON.parse(text);
const vulns = data.vulnerabilities || {};
for (const [pkg, info] of Object.entries(vulns)) {
  console.log(`=== ${pkg} [${info.severity}]`);
  if (info.fixAvailable) {
    console.log('fixAvailable:', `${info.fixAvailable.name}@${info.fixAvailable.version}`);
  } else {
    console.log('fixAvailable: none');
  }
  if (info.findings) {
    info.findings.forEach(f => {
      if (f.path) console.log('path:', f.path);
    });
  }
  if (info.paths) {
    console.log('paths:', info.paths.join(', '));
  }
}
