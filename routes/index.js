var express = require('express');
var puppeteer = require('puppeteer');
var router = express.Router();
var Chance = require('chance');
var chance = new Chance();
var fs = require('fs');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

async function getStyle(page, tag) {
    console.log('getting', tag);
    const doc = await page._client.send('DOM.getDocument');
    const nodes = await page._client.send('DOM.querySelectorAll', {
        nodeId  : doc.root.nodeId,
        selector: tag
    });
    var flattenCss = {};
    console.log(nodes.nodeIds);
    for (id of nodes.nodeIds) {
        var css = await page._client.send('CSS.getMatchedStylesForNode', {nodeId: id});
        var rules = css.matchedCSSRules;
        rules.push({rule: {style: css.inlineStyle}});
        console.log(css);
        for (var i = 0; i < rules.length; i++) {
            var properties = rules[i].rule.style.cssProperties;
            for (var j = 0; j < properties.length; j++) {
                flattenCss[properties[j].name] = properties[j].value;
            }
        }
    }
    return flattenCss;
}

router.get('/pdf_batch', async (req, res, next) => {
    var n = req.query.n || 1;
    var fileNames = [];
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const rootHost = req.protocol + '://' + req.get('host');
    for (var i = 0; i < n; i++) {
        try {
            console.log('Going to ' + rootHost);
            await page.goto(rootHost, {waitUntil: 'networkidle2'});
            await page._client.send('DOM.enable');
            await page._client.send('CSS.enable');
            const watchDog = page.waitForSelector('.icon-done');
            await watchDog;
            var bodyStyle = await getStyle(page, 'body');
            var companyName = await page.$eval('.company-name', c => c.innerText);
            var fileName = companyName.replace(/\s/g, '_');

            var pdf = await page.pdf({
                path           : 'output/' + fileName + '.pdf',
                printBackground: true,
                format         : 'A4',
                margin         : {
                    top: chance.floating({min: 0, max: 3})
                }
            });
            fs.writeFileSync('output/' + fileName + '.html', await page.content());
            fileNames.push({
                name : fileName + '.pdf',
                style: bodyStyle
            });
        } catch (e) {
            console.error(e);
        }

    }
    await browser.close();
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(fileNames));
});

router.get('/pdf', async (req, res, next) => {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        const rootHost = req.protocol + '://' + req.get('host');
        console.log('Going to ' + rootHost);
        await page.goto(rootHost, {waitUntil: 'networkidle2'});
        const watchDog = page.waitForSelector('.icon-done');
        await watchDog;
        var companyName = await page.$eval('.company-name', c => c.innerText);
        var useHeader = Math.random() < 0.9 && false;
        var useFooter = Math.random() < 0.9 && false;
        var header = await page.$eval('header', h => h.innerHTML);
        var footer = await page.$eval('footer', f => f.innerHTML);
        if (useHeader) {
            await page.$eval('header', h => h.remove());
        }
        if (useFooter) {
            await page.$eval('footer', f => f.remove());
        }

        var fileName = companyName.replace(/\s/g, '_');

        console.log('Done');
        var pdf = await page.pdf({
            printBackground    : true,
            displayHeaderFooter: true,
            format             : 'A4',
            headerTemplate     : (useHeader ?
                                  '<div style="float:' + chance.pickone(
                                      ['left', 'right', 'none']) + ' ">' + header + '</div>' : ''),
            footerTemplate     :
            '<div id="pageMarking" style="float: ' + chance.pickone(['left', 'right', 'none']) + '">' +
            '<span class="pageNumber"></span>' + chance.pickone([' of ', ' / ']) + '<span' +
            ' class="totalPages"></span>' +
            '</div>' + (useFooter
                        ? '<div style="float: ' + chance.pickone(['left', 'right', 'none']) + '">' + footer + '</div>'
                        : ''),
            margin             : {
                top: chance.floating({min: 0, max: 3})
            }
        });
        await browser.close();
        console.log(pdf);
        console.log(fileName);
        console.log(header);
        console.log(footer);
        res.writeHead(200, {
            'Content-Type'       : 'application/pdf',
            'Content-Disposition': 'inline; filename=' + fileName + '.pdf',
            'Content-Length'     : pdf.length
        });
        res.end(pdf);
    } catch (e) {
        console.error(e);
    }
});

module.exports = router;
