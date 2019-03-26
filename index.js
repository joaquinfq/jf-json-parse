const fs   = require('fs');
const path = require('path');

/**
 * Lee el archivo JSON o el texto en formato JSON y busca los archivos JSON incluidos.
 * Si un archivo no existe se deja el texto tal cual.
 *
 * @param {string} filename Ruta al archivo a leer o texto en formato JSON.
 * @param {object} cache    Archivos y textos procesados previamente.
 * @param {object} cwd      Directorio actual a usar para resolver las inclusiones.
 *
 * @return {string|null} Texto JSON luego de ser procesado o `null` si no se pudo procesar.
 */
function loadJsonFile(filename, cache, cwd)
{
    let _content = null;
    if (filename.toLowerCase().endsWith('.json'))
    {
        const _filename = path.resolve(cwd, filename);
        if (fs.existsSync(_filename))
        {
            if (_filename in cache)
            {
                _content = cache[_filename];
            }
            else
            {
                //------------------------------------------------------------------------------
                // La doble asignación se hace para evitar recursividades ya que si se trata de
                // incluir el mismo archivo al estar en caché no se analizaría.
                // Es un caso que no debería darse pero lo contemplamos.
                //------------------------------------------------------------------------------
                cache[_filename] = _content = fs.readFileSync(_filename, 'utf8');
                cache[_filename] = _content = parseJson(_content, cache, path.dirname(_filename));
            }
        }
        else
        {
            cache[_filename] = null;
        }
    }
    else
    {
        try
        {
            JSON.parse(filename);
            _content = parseJson(filename, cache, cwd);
        }
        catch (e)
        {
        }
    }

    return _content;
}

/**
 * Lee el texto en formato JSON y busca los archivos JSON incluidos.
 * Si un archivo no existe se deja el texto tal cual.
 *
 * @param {string} json  Texto en formato JSON a analizar.
 * @param {object} cache Archivos y textos procesados previamente.
 * @param {object} cwd   Directorio actual a usar para resolver las inclusiones.
 *
 * @return {string} Texto en formato JSON con las inclusiones resueltas.
 */
function parseJson(json, cache, cwd)
{
    return json.replace(
        /"([^"]+\.json)"/gi,
        (match, jsonFile) =>
        {
            const _json = loadJsonFile(jsonFile, cache, cwd);

            return _json === null
                ? match
                : _json;
        }
    );
}

/**
 * Lee un archivo o un texto JSON y resuelve de manera recursiva todos
 * los archivos JSON requeridos.
 *
 * Las rutas de los archivos son relativas al archivo incluido.
 *
 * @param {string} filename Ruta al archivo a leer.
 * @param {object} cache    Archivos y textos procesados previamente.
 * @param {object} cwd      Directorio actual a usar para resolver las inclusiones si `filename` es un texto JSON.
 *
 * @return {object|null} Resultado del análisis o `null` si no se pudo analizar el contenido.
 */
module.exports = function jfJsonParse(filename, cache = {}, cwd = null)
{
    let _result;
    try
    {
        _result = JSON.parse(loadJsonFile(filename, cache || {}, cwd || path.dirname(filename)));
    }
    catch (e)
    {
        _result = null;
    }

    return _result;
};
