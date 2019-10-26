const puppeteer = require('puppeteer');
const axios = require('axios');

(async () => {
    const browser = await puppeteer.launch({ headless: true, args: ["--disable-dev-shm-usage", "--disable-gpu", "--no-sandbox"]});
    const page = await browser.newPage();
    await page.goto("https://twitter.com/");
    await page.waitFor("a.js-nav.StaticLoggedOutHomePage-buttonLogin");
    await page.click("a.js-nav.StaticLoggedOutHomePage-buttonLogin");
    await page.waitFor("input.js-username-field");
    await page.type("input.js-username-field", "filipasag@imail8.net", { delay : 50 });
    await page.type("input.js-password-field", "whomstnou123", { delay: 50 });
    await page.click("button.submit");
    await page.waitFor(2000);
    await page.goto("https://twitter.com/JetBlue/with_replies");    
    await page.waitFor('article');
    

    let processed = {};
    
    const run = async () => {
        let elements = await page.$$('article');
        console.log(elements.length);

        const lengthOfElements = elements.length;
        let elementIndex = 0;
        const promiseArray = [];

        for (let i = 0; i < elements.length; i += 1) {
            let element = elements[i];
            if (element != undefined) {
                console.log(i);
                let e1 = await element.asElement();
                let e2 = await e1.$('div:first-child');
                let e3 = await e2.asElement();
                let e4 = await e3.$('div:first-child');
                e4.click();
                await page.waitFor('article');
                await page.waitFor(2000);
                const tweets = await page.$$('article');
                
                let data = [];
                
                for (let i = 0; i < tweets.length; i += 1) {
                    let tweet = tweets[i];
                    let p = await (await tweet.getProperty('innerText')).jsonValue();
                    //let p = tweet.innerText;
                    if (p == "") {
                        data.push({});
                    } else {
                        let parsed = p.split("\n");
                        let name = parsed.shift();
                        let content = parsed.join("\n");
                        data.push({ name, content });
                    }                    
                }
                
                await axios.post("http://localhost:10000/saveData", data);
                
                
                if (await page.url() != "https://twitter.com/JetBlue/with_replies") {
                    await page.goBack({ waitUntil: "domcontentloaded"});
                }            
                
                await page.waitFor(1000);
                elements = await page.$$('article');
            }
        }
        /*
          while (elementIndex < lengthOfElements) {
          try {
          if (elements[elementIndex] != undefined) {
          if processed[await elements[elementIndex].getProperty()]
          processed[elements[elementIndex]] = true;
          await elements[elementIndex].click();
          await page.waitFor('article');
          await page.waitFor(2000);
          const tweets = await page.$$('article');
          
          let data = [];
          
          for (let i = 0; i < tweets.length; i += 1) {
          let tweet = tweets[i];
          let p = await (await tweet.getProperty('innerText')).jsonValue();
          //let p = tweet.innerText;
          let parsed = p.split("\n");
          let name = parsed.shift();
          let content = parsed.join("\n");
          data.push({ name, content });
          }
          
          await axios.post("http://localhost:10000/saveData", data);
          
          
          if (await page.url() != "https://twitter.com/JetBlue/with_replies") {
          await page.goBack({ waitUntil: "domcontentloaded"});
          }            
          //await page.waitFor(1000);

          //await page.waitFor('article');
          elements = await page.$$('article');
          }
          } catch (error) {
          if (await page.url() != "https://twitter.com/JetBlue/with_replies") {
          await page.goBack({ waitUntil: "domcontentloaded"});
          }            
          // ignore the error, nad move on
          }
          elementIndex += 1;
          }

        */

        //await Promise.all(promiseArray);
        return Promise.resolve("done");
    };
    
    let count = 0;
    while (count < 1000) {
        await run();
        
        await page.evaluate(() => {
            let elements = document.querySelectorAll('article');
            elements[elements.length - 1].scrollIntoView();
            return "done";
        });
        // wait for any gifs to load
        await page.waitFor(5000);
        count += 1;
    }    

    await browser.close();
})();


const sleep = async (ms) => {
    await new Promise((resolve, reject) => {
        setTimeout(resolve, ms);
    });
};


const results = [];


const run2 = async () => {
    let elements = document.querySelectorAll('article');
    let lengthOfElements = elements.length;
    
    let elementIndex = 0;
    let promiseArray = [];
    while (elementIndex < lengthOfElements) {
        await new Promise(async (resolve, reject) => {
            let currE = elements[elementIndex];
            currE.click();

            //while (document.querySelectorAll('article').length == lengthOfElements
            //       || document.querySelectorAll('article').length == 0
            //       || document.readyState != "complete") {
            //    await sleep(100);
            //}

            await sleep(1000);

            let tweets = document.querySelectorAll('article');
            let data = [];
            tweets.forEach((tweet) => { 
                let parsed = tweet.innerText.split("\n");
                let name = parsed.shift();
                let content = parsed.join("\n");
                data.push({ name, content });
            });

            //promiseArray.push(new Promise(async (resolve, reject) => {
            //    await axios.post("http://localhost:10000/saveData", data);
            //    resolve();
            //}));

            results.push(data);

            window.history.go(-1);
            
            await sleep(1000);
            resolve();
        });
        
        elementIndex += 1;
    }

    elements[elementIndex - 1].scrollIntoView();
    //await Promise.all(promiseArray);
    
    while (document.querySelectorAll('article').length <= lengthOfElements) {
        await sleep(1000);
    }

    return "done with 1 cycle";
};


