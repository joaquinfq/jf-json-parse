const assert      = require('assert');
const jfJsonParse = require('../index');
const path        = require('path');
//------------------------------------------------------------------------------
// Verificamos la inclusión de los archivos existentes.
//------------------------------------------------------------------------------
const cache   = {};
const content = jfJsonParse(path.join(__dirname, 'index.json'), cache);
assert.deepEqual(
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
        e : '/tmp/e.json'
    },
    content
);
//------------------------------------------------------------------------------
// Verificamos que los archivos del caché coincidan.
//------------------------------------------------------------------------------
assert.deepEqual(
    [
        'archivo a.json',
        'a.json',
        'b.json',
        'd.json',
        '/tmp/e.json'
    ],
    Object.keys(cache).map(k => k.replace(__dirname + path.sep, ''))
);
