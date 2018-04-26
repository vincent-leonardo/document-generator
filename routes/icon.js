var express = require('express');
var puppeteer = require('puppeteer');
var Chance = require('chance');
var chance = new Chance();
var router = express.Router();
var Jimp = require("jimp");

router.get('/', async (req, res, next) => {
    var imgSrc = '';
    try {
        var companyName = req.query.companyName;
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        const watchDog = page.waitForSelector('.loaded');
        await page.goto('http://emblemmatic.org/markmaker');
        await page.type('#em-company-name-field', companyName, {delay: chance.floating({min: 10, max: 300})});
        await page.tap('button[type=submit]');
        await watchDog;
        imgSrc = await page.$eval('.loaded .em-logo-wrapper img', img => img.src);
        await browser.close();
        Jimp.read(Buffer.from(imgSrc.replace(/^data:image\/png;base64,/, ''), 'base64'), function (err, img) {
            img.autocrop();
            img.getBase64('image/png', function (err, base64Str) {
                res.send(base64Str);
            });
        });
    } catch (e) {
        console.error(e);
    }
});

module.exports = router;
