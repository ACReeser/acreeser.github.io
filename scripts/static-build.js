const fse = require('fs-extra')
const path = require('path')
const { promisify } = require('util')
const globP = promisify(require('glob'))

const srcPath = '.';
const destPath = '.';
let template = '';

fse.readFile('./templates/index.dot.html', 'utf-8').then((_template) => {
  // read page template
  template = _template;
  console.log(template);
  return globP('**/*.partial.html', { cwd: `${srcPath}/partials` })
}).then((files) => {
  files.forEach((file) => {
    console.log(`found partial ${file}`);
    
    fse.readFile(`${srcPath}/partials/${file}`, 'utf-8').then((content) => {
      fse.writeFile(`${destPath}/${file.replace('.partial', '')}`, template.replace('{{partial}}', content))
    });
  });
})
.catch((err) => { console.error(err) })