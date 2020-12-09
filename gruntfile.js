module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        copy: {
            main: {
                files: [{
                    src: 'partials/*.partial.html',
                    dest: 'dot_partials/',
                    expand: true,
                    rename: function (dest, src) {
                        grunt.log.writeln('rename ' + dest + ' ' + src);
                        //remove the partials directory and change the extension
                        return dest + src.replace('partials/', '').replace('.partial.html', '.dot.html');
                    }
                }],
                options: {
                    process: function (content, srcpath) {
                        return ('{\n"template": "index.dot.html"\n}\n\n' + content);
                    },
                }
            },
        },
        zetzer: {
            main: {
                options: {
                    partials: "dot_partials",
                    templates: "templates"
                },
                files: [
                  {
                      expand: true,
                      //cwd: "/",
                      src: "dot_partials/*.dot.html",
                      dest: "",
                      ext: ".html",
                      flatten: true
                  }
                ]
            },
        }
    });
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-zetzer');

    //run copy to turn *.partials into dot_partials/ after prepending template tag
    //then run zetzer to turn dot_partials/*.dot.html into /*.html
    grunt.registerTask('default', ['copy', 'zetzer']);
};