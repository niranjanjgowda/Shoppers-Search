search_query = "iphone 11";

e_url = "https://www.ebay.com/sch/i.html?_nkw="+search_query;

const axios = require('axios');
const cheerio = require('cheerio');

async function extractProductDetailsebay(url) {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const products = [];
    $('.s-item').each((i, element) => {
    const name = $(element).find('.s-item__title').text().trim();
    const price = $(element).find('.s-item__price').text().trim();
    const imageUrl = $(element).find('.s-item__image-wrapper')['0'].children[0].attribs['src'];
    const productUrl = $(element).find('.s-item__link').attr('href');
    products.push({ name, price, imageUrl, productUrl });
    });
    console.log(products);
}

extractProductDetailsebay(e_url).then();

