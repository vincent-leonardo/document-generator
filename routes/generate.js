var express = require('express');
var puppeteer = require('puppeteer');
var Chance = require('chance');
var router = express.Router();
var chance = new Chance();

/* GET icon. */
router.get('/', async (req, res, next) => {
	var companyName = req.query.companyName;
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	const watchDog = page.waitForSelector('.loaded');
	await page.goto('http://emblemmatic.org/markmaker');
	await page.type('#em-company-name-field', req.query.companyName, {delay: 100});
	await page.tap('button[type=submit]');
	await watchDog;
	// console.log(await page.content());
	var imgSrc = await page.$eval('.loaded .em-logo-wrapper img', img => img.src);
	console.log(imgSrc);

	await browser.close();


  	res.send(imgSrc);
});

module.exports = router;
