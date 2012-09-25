var fs = require("fs"),
    path = require('path');
var compress = function (jsonFile,version) {
    var filePath = path.resolve(__filename),
        buildPath = path.resolve(filePath, '../..'),
        jsonPath = path.resolve(buildPath, jsonFile)
    var json = JSON.parse(fs.readFileSync(jsonPath));
    console.log("merge and compress config json :" + json)

    //merge
    var input = json.input,
        output = json.output,
        content = [];

    if (!input || !output) {
        return;
    }
    input.forEach(function (file) {
        content.push(fs.readFileSync(path.resolve(jsonPath, "../" + file)).toString());
    });
    content = content.join('\n');
    var outputPath = path.resolve(jsonPath, "../" + output+ (version ?"."+version:""));
    fs.writeFile(outputPath + ".js", content, 'utf-8');

    console.log("merge successfully at:" + outputPath + ".js\n", "...");

    //compress
    var jsp = require('uglify-js').parser,
        pro = require('uglify-js').uglify;

    var code = content,
        ast = jsp.parse(code);

    ast = pro.ast_mangle(ast);
    ast = pro.ast_squeeze(ast,{make_seqs:false});
    code = pro.gen_code(ast);
    fs.writeFile(outputPath+".min.js", code, 'utf-8');
    console.log('compress successfully at:' + outputPath+".min.js");


}

exports.compress = compress;