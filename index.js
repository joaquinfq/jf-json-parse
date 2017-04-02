const fs   = require('fs');
const path = require('path');
/**
 * Lee el archivo JSON y busca los archivos JSON incluidos.
 * Si un archivo no existe se deja el texto tal cual.
 *
 * @param {String} filename Ruta al archivo a leer.
 * @param {Object} cache    Archivos y textos procesados previamente.
 *
 * @return {String|Boolean}
 */
function loadJsonFile(filename, cache = {})
{
    let _content = false;
    if (path.extname(filename) === '.json' && fs.existsSync(filename))
    {
        const _dirname = path.dirname(filename);
        _content       = fs.readFileSync(filename, 'utf8').replace(
            /"([^"]+\.json)"/g,
            (match, jsonFile) => {
                let _result;
                const _filename = path.resolve(_dirname, jsonFile);
                if (_filename in cache)
                {
                    _result = cache[_filename];
                }
                else
                {
                    _result = loadJsonFile(path.resolve(_dirname, jsonFile), cache);
                    if (_result === false)
                    {
                        // Dejamos el texto tal como estaba.
                        _result = `"${jsonFile}"`;
                    }
                    cache[_filename] = _result;
                }

                return _result;
            }
        );
    }
    return _content;
}
/**
 * Lee un archivo JSON y resuelve de manera recursiva todos
 * los archivos JSON requeridos.
 *
 * Las rutas de los archivos son relativas al archivo incluido.
 *
 * @param {String} filename Ruta al archivo a leer.
 * @param {Object} cache    Archivos y textos procesados previamente.
 *
 * @return {Object}
 */
module.exports = function jfJsonParse(filename, cache = {})
{
    if (fs.existsSync(filename))
    {
        filename = JSON.parse(loadJsonFile(filename, cache));
    }
    else
    {
        throw new TypeError('File not found: ' + filename);
    }
    return filename;
};
