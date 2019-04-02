const path = 'http://localhost:3000/static/images';
module.exports = function saveImage(image) {
    return new Promise((resolve, reject) => {
        image.mv(`${__dirname}/../build/static/images/${image.name}`, err => {
            err ? reject(err)
                : resolve(`${path}/${image.name}`);
        });
    })
        .then(staticPath => staticPath, err => err);
}