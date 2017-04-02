# jf-json-parse [![stable](http://badges.github.io/stability-badges/dist/stable.svg)](http://github.com/badges/stability-badges)

[![npm install jf-json-parse](https://nodei.co/npm/jf-json-parse.png?mini=true)](https://npmjs.org/package/jf-json-parse/)

Parse a JSON file replacing all files included with their contents.
If a file does not exist the text is not replaced.


### Example

```js
// a.json
{
    "a1" : "Texto del archivo A",
    "a2" : "archivo a.json"
}
```

```js
// b.json
{
    "b1" : "Archivo B",
    "b2" : "./a.json"
}
```

```js
// index.json
{
    "a" : "a.json",
    "b" : "./b.json",
    "c" : "Clave c",
    "d" : "d.json",
    "e" : "/tmp/e.json"
}
```

```js
const jfJsonParse = require('jf-json-parse');

console.log(
    jfJsonParse('./index.json'),
    {
        '/tmp/e.json' : '"fake content"'
    }
);
/*
{
    "a": {
        "a1": "Texto del archivo A",
        "a2": "archivo a.json"
    },
    "b": {
        "b1": "Archivo B",
        "b2": {
            "a1": "Texto del archivo A",
            "a2": "archivo a.json"
        }
    },
    "c": "Clave c",
    "d": "d.json",
    "e": "fake content"
}
*/
```

### Cache

You can pass an object as second parameter as cache.
If the key exists in cache, this value will be used instead file on disk.

After parse JSON, in cache object you will have all the files that were tried to read.
So you can pass the same cache object between calls to `jfJsonParse` and no files
will be read twice.

```js
const jfJsonParse = require('jf-json-parse');
const cache       = {};

jfJsonParse('./index.json', cache);

// There is no file readings because for this JSON all files are in cache.
jfJsonParse('./index.json', cache);

// For this JSON only will read x.json because there is not in cache.
// z.json: { "a": "a.json", x: "x.json" }
jfJsonParse('./z.json', cache);
```
