var fs = require('fs')
var path = require('path')
module.exports = {
    upload: function (filename, content) {
        return new Promise(function (resolve, reject) {
            fs.writeFile(
                path.join(__dirname, '../../_cache/', filename),
                content,
                function (err) {
                    if (err) {
                        reject(err.message)
                    }
                    else {
                        resolve()
                    }
                }
            )
        })
    },
    download: function (filename) {
        return new Promise(function (resolve, reject) {
            fs.exists(filename, function (exists) {
                if (!exists) {
                    reject()
                }
                else {
                    fs.readFile(
                        path.join(__dirname, '../../_cache/', filename),
                        function (err, content) {
                            if (err) {
                                reject(err.message)
                            }
                            else {
                                resolve(content.toString())
                            }
                        }
                    )
                }
            })
        })
    }
}
