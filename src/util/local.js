var fs = require('fs')
var path = require('path')
var cache = {}
module.exports = {
    upload: function (filename, content) {
        return new Promise(function (resolve, reject) {
            cache[filename] = content
            resolve()
        })
    },
    download: function (filename) {
        return new Promise(function (resolve, reject) {
            if (typeof cache[filename] === 'undefined') {
                resolve()
            }
            else {
                resolve(cache[filename])
            }

        })
    }
}
