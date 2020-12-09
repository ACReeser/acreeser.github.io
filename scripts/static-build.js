const fse = require('fs-extra')
const path = require('path')
const { promisify } = require('util')
const globP = promisify(require('glob'))
const config = require('../site.config')

const srcPath = '.'
const distPath = '.'

fse.readFile('./templates/index.dot.html').then((err, data) => {
})

// read page templates
globP('**/*.partial.html', { cwd: `${srcPath}/partials` })
  .then((files) => {
    files.forEach((file) => {
      const fileData = path.parse(file)
      const destPath = path.join(distPath, fileData.dir)

      // create destination directory
      fse.mkdirs(destPath)
        .then(() => {
          // render page
          return ejsRenderFile(`${srcPath}/pages/${file}`, Object.assign({}, config))
        })
        .then((pageContents) => {
          // render layout with page contents
          return ejsRenderFile(`${srcPath}/layout.ejs`, Object.assign({}, config, { body: pageContents }))
        })
        .then((layoutContent) => {
          // save the html file
          fse.writeFile(`${destPath}/${fileData.name}.html`, layoutContent)
        })
        .catch((err) => { console.error(err) })
    })
  })
  .catch((err) => { console.error(err) })