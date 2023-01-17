const { data } = require('cheerio/lib/api/attributes');

function scrape()
{
    search_query = localStorage.getItem("searchquery");
    minprice = parseInt(localStorage.getItem("minvalue"));
    const cheerio = require('cheerio');

    async function extractProductDetailsAmazon(url) {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const products = [];
    $('.s-result-item').each((i, element) => {
        const name = $(element).find('.s-line-clamp-2').text().trim();
        const price = $(element).find('.a-offscreen').text().trim().split("$")[1];
        const imageUrl = $(element).find('.s-image').attr('src');
        const productUrl = $(element).find('.a-link-normal').attr('href');
        products.push({ name, price, imageUrl, productUrl });
    });
    const productsArray = Object.values(products);
    return productsArray.sort((a, b) => {
        return a.price - b.price
    });
    }

    async function extractProductDetailsebay(url) {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        const products = [];
        $('.s-item').each((i, element) => {
        const name = $(element).find('.s-item__title').text().trim();
        const price = $(element).find('.s-item__price').text().trim();
        const imageUrl = $(element).find('.s-item__image-img').attr('src');
        const productUrl = $(element).find('.s-item__link').attr('href');
        products.push({ name, price, imageUrl, productUrl });
        });
        return products;
    }

    async function extractProductDetailsFlipkart(url) {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        const products = [];
        $('._1AtVbE').each((i, element) => {
        const name = $(element).find('._4rR01T').text().trim();
        const price = $(element).find('._30jeq3').text().trim().split("$")[1];
        const imageUrl = $(element).find('._396cs4').attr('src');
        const productUrl = $(element).find('._1fQZEK').attr('href');
        products.push({ name, price, imageUrl, productUrl });
        });
        return products;
    }
      
    a_url = "https://www.amazon.com/s?k="+search_query;
    f_url = "https://www.flipkart.com/search?q="+search_query;
    e_url = "https://www.ebay.com/sch/i.html?_nkw="+search_query;

    let pdata = "";
    let leastprice = 200000;
    let leastpricepricename = "";
    let leastpriceurl = "";
    let leastpriceimg = "";
    let leastpricewebsite = "";
    extractProductDetailsAmazon(a_url).then(products => {
        pdata += '<h1>Amazon</h1><div class="amazon">';
        for(i=0;i<products.length-1;i++)
        {
        if(products[i]["name"]!=""&&products[i]["price"]!=""&&products[i]["price"]>(minprice/80))
        {
         pdata += '<div class="products"> <a target="_blank" href="'+'https://www.amazon.com'+products[i]["productUrl"]+'">'
            +'<img src="'+products[i]["imageUrl"]+'" alt="'+products[i]["name"]+'" height="" width=""><br>'
            +'<span style="color:red">'+products[i]["name"]+products[i]["price"]+'</span>'
    +'</a></div>';
            
            if(leastprice>=products[i]["price"]*80)
            {
                leastprice = products[i]["price"]*80;
                leastpricepricename = products[i]["name"];
                leastpriceurl = "https://www.amazon.com"+products[i]["productUrl"];
                leastpriceimg = products[i]["imageUrl"];
                leastpricewebsite = "amazon";
            }
        }
        }
        pdata +="</div>"
        document.getElementById("product-list-amazon").innerHTML = pdata;
    });
    

    extractProductDetailsFlipkart(f_url).then(products => {
        fdata = '<h1>FilpKart</h1><div class="flipkart">';
        for(i=0;i<products.length-1;i++)
        {
        if(products[i]["name"]!=""&&products[i]["price"]!="")
        {
         fdata += '<div class="products"> <a target="_blank" href="'+'https://www.flipkart.com'+products[i]["productUrl"]+'">'
            +'<img src="'+products[i]["imageUrl"]+'" alt="'+products[i]["name"]+'" height="" width=""><br>'
            +'<span style="color:red">'+products[i]["name"]+products[i]["price"]+'</span>'
    +'</a></div>';

        if(leastprice>=products[i]["price"])
        {
            leastprice = products[i]["price"];
            leastpricepricename = products[i]["name"];
            leastpriceurl = "https://www.flipkart.com" + products[i]["productUrl"];
            leastpriceimg = products[i]["imageUrl"];
            leastpricewebsite = "flipkart";
        }
        }
        }
        fdata +="</div>"
        document.getElementById("product-list-flipkart").innerHTML = fdata;
    });

    
    extractProductDetailsebay(e_url).then(products => {
        edata = '<h1>EBAY</h1><div class="E-bay">';
        for(i=1;i<products.length-1;i++)
        {
        if(products[i]["name"]!=""&&products[i]["price"]!=""&&products[i]["price"].split("$")[1]*80>minprice)       
        {
         edata += '<div class="products"> <a target="_blank" href="'+products[i]["productUrl"]+'">'
            +'<img src="'+products[i]["imageUrl"]+'" alt="'+products[i]["name"]+'" height="" width=""><br>'
            +'<span style="color:red">'+products[i]["name"]+products[i]["price"]+'</span>'
    +'</a></div>';
        }
        }
        edata +="</div>";
        document.getElementById("product-list-ebay").innerHTML = edata;

        if(leastprice)
        {
            document.getElementById("bestmatch").innerHTML = "<h1>best price on "+leastpricewebsite+"</h1>"+
            '<a target="_blank" href = "'+ leastpriceurl +'">+<img src="'+ leastpriceimg +'" alt="'+
            leastpricepricename +'" height="" width=""><br>'
            +'<span style="color:red">'+products[i]["price"]+'</span>'+'</a>';
            console.log(leastprice + leastpriceurl + leastpricewebsite);
        }
    });
}

scrape();