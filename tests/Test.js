const fs          = require('fs');
const jfJsonParse = require('../index');
const jfTestsUnit = require('@jf/tests/src/type/Unit');
const path        = require('path');
/**
 * Pruebas unitarias.
 */
module.exports = class jfNodeTest extends jfTestsUnit
{
    /**
     * @override
     */
    static get title()
    {
        return '@jf/json-parse';
    }

    /**
     * Verifica la inclusión de los archivos existentes.
     */
    testExistingFiles()
    {
        const _cache = {};
        this._assert(
            '',
            {
                a : require('./a.json'),
                b : Object.assign(
                    require('./b.json'),
                    {
                        b2 : require('./a.json')
                    }
                ),
                c : 'Clave c',
                d : 'd.json',
                e : '/tmp/e.json',
                u : JSON.parse(fs.readFileSync(path.join(__dirname, 'UP.JSON')))
            },
            jfJsonParse(path.join(__dirname, 'index.json'), _cache)
        );
        this._assert(
            '',
            [
                'UP.JSON',
                'a.json',
                'archivo a.json',
                'b.json',
                'd.json',
                'index.json',
                '/tmp/e.json'
            ],
            Object.keys(_cache).sort().map(k => k.replace(__dirname + path.sep, ''))
        );
    }

    /**
     * Verifica que los archivos del caché coincidan.
     */
    testJsonString()
    {
        this._assert(
            '',
            {
                a : require('./a.json'),
                b : Object.assign(
                    require('./b.json'),
                    {
                        b2 : require('./a.json')
                    }
                ),
                c : 'Clave c',
                d : 'd.json',
                e : '/tmp/e.json',
                u : JSON.parse(fs.readFileSync(path.join(__dirname, 'UP.JSON')))
            },
            jfJsonParse(fs.readFileSync(path.join(__dirname, 'index.json'), 'utf8'), {}, __dirname)
        );
    }

    /**
     * Verifica la inclusión de archivos recursivos.
     */
    testRecursive()
    {
        this._assert(
            '',
            jfJsonParse(path.join(__dirname, 'recursive.json')),
            {
                recursive : require('./recursive.json')
            }
        );
    }

    /**
     * Verifica los parámetros opcionales.
     */
    testParams()
    {
        const _a = { a : Date.now(), b : Math.random() };
        const _j = JSON.stringify(_a);
        this._assert('', jfJsonParse(null), null);
        this._assert('', jfJsonParse(_j), _a);
        this._assert('', jfJsonParse(_j, null), _a);
        this._assert('', jfJsonParse(_j, null, null), _a);
    }
};
