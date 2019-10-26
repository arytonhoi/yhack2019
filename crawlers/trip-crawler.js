const puppeteer = require('puppeteer');
const axios = require('axios');

(async () => {
    const browser = await puppeteer.launch({ headless: true, args: ["--disable-dev-shm-usage", "--disable-gpu", "--no-sandbox"]});
    const page = await browser.newPage();
    await page.goto("https://www.tripadvisor.com/Airline_Review-d8729099-Reviews-JetBlue");
    await page.waitFor(5000);

    const run = async () => {
        await page.evaluate(() => {
            window.scrollBy(0, 3000);
            return Promise.resolve("done");
        });

        console.log("got here");
        
        const reviewData = await page.evaluate(async () => {            
            document.querySelector('span[class*="ExpandableReview"]').click();
            await new Promise((resolve) => setTimeout(resolve, 300));
            let reviews = document.querySelectorAll('div[data-tab="TABS_REVIEWS"] > div:nth-child(2) div[class*="location-review-card"]');

            
            let reviewData = [];
            for(let i = 0; i < reviews.length; i += 1) {
                let review = reviews[i];
                if (review != undefined) {
                    let header = review.querySelector('[class*="ReviewCardHeader"]');
                    let name = header.innerText;
                    let categories = review.querySelector('[class*="labelsContainer"]').innerText.split('\n');
                    let content = review.querySelector('[class*="ReadMore__content"]').innerText;
                    
                    reviewData.push({ name, categories, content });
                }
            }
            return reviewData;
        });

        for (let i = 0; i < reviewData.length; i += 1) {
            await axios.post("http://localhost:10000/saveData", reviewData[i]);
        }

        return "done";
    };
    
    let count = 0;
    while (count < 1000) {
        await run();
        await page.click('div[data-tab="TABS_REVIEWS"] .next');
        await page.waitFor(2000);
        
        let pages = await browser.pages();
        console.log(pages);
        for (let i = 0; i < pages.length; i += 1) {
            let p = pages[i];
            if (! p.url().includes("tripadvisor")) {
                await p.close();
            }
        }
        count += 1;
    }    
    await browser.close();
})();
