var fs = require("fs"),
    path = require('path');
var combo = function (jsonFile) {
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
    var outputPath = path.resolve(jsonPath, "../" + output);

    console.log("merge successfully \n", "...");

    //compress
    var jsp = require('uglify-js').parser,
        pro = require('uglify-js').uglify;

    var code = content.join('\n'),
        ast = jsp.parse(code);

    ast = pro.ast_mangle(ast);
    ast = pro.ast_squeeze(ast);
    code = pro.gen_code(ast);
    fs.writeFile(outputPath, code, 'utf-8');
    console.log('compress successfully at ' + outputPath);


}

exports.combo = combo;