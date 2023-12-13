const { data } = require('cheerio/lib/api/attributes');

function scrape()
{
    let coverstion_rate_inr_to_usd = 81;
    search_query = localStorage.getItem("searchquery");
    minprice = parseInt(localStorage.getItem("minvalue"));
    const cheerio = require('cheerio');

    async function test(url){
        try{
            const temp = await axios.get(url);
            document.getElementById("bestall").style = "visibility: visible;"
        }
        catch(e)
        {
            document.getElementById("cors").innerHTML = '<h1><center>Install or Enable <a href="https://chromewebstore.google.com/detail/cors-unblock/lfhmikememgdcahcdlaciloancbhjino">CORS UNBLOCK </a> or Check your Internet connection</center></h1>'; 
        }
    }

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
        const imageUrl = $(element).find('.s-item__image-wrapper')['0'].children[0].attribs['src'];
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
        const price = $(element).find('._30jeq3').text().trim();
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

    test(e_url).then();

    extractProductDetailsAmazon(a_url).then(products => {
        pdata += '<h1>Amazon</h1><div id="amazon" class="amazon">';
        let count = 0 ;
        let leastprice = 200000;
        for(i=0;i<products.length-1;i++)
        {
        if(products[i]["name"]!=""&&products[i]["price"]!=""&&products[i]["price"]>(minprice/80))
        {
            count+=1;
         pdata += '<div class="products"> <a target="_blank" href="'+'https://www.amazon.com'+products[i]["productUrl"]+'">'
            +'<img src="'+products[i]["imageUrl"]+'" alt="'+products[i]["name"]+'" height="" width=""><br>'
            +'<span class = "name">'+products[i]["name"]+'</span>'
            +'<span class = "price">'+"&#8377;"+(products[i]["price"]*coverstion_rate_inr_to_usd).toFixed(0)+'</span>'
            +'</a></div>';

            if(parseFloat(products[i]["price"])<parseFloat(""+leastprice))
            {
                leastprice = products[i]["price"];
                leastpricepricename = products[i]["name"];
                leastpriceurl = "https://www.amazon.com"+products[i]["productUrl"];
                leastpriceimg = products[i]["imageUrl"];
            }
        }
        }
        pdata +="</div>"
        document.getElementById("product-list-amazon").innerHTML = pdata;
        if(count==0)
            document.getElementById("amazon").innerHTML = "<h1 style='text-align:center;margin-left:15%;'>No Products Available please try again later</h1>";

        if(leastprice!=200000)
        {
            document.getElementById("bestamazon").innerHTML = '<div class="products"> <a target="_blank" href="'+'https://www.amazon.com'+leastpriceurl+'">'
            +'<img src="'+leastpriceimg+'" alt="'+leastpricepricename+'" height="" width=""><br>'
            +'<span class = "name">'+leastpricepricename+'</span>'
            +'<span class = "price">'+"&#8377;"+(leastprice*coverstion_rate_inr_to_usd).toFixed(0)+'</span>'
            +'</a></div>';
        }
        else
        {
            document.getElementById("bestamazon").innerHTML = '<h1 style="margin-top: 60px;margin-left: 20px;">No products</h1>'; 
        }

    });
    

    extractProductDetailsFlipkart(f_url).then(products => {
        fdata = '<h1>FlipKart</h1><div id="flipkart" class="flipkart">';
        let count = 0;
        leastprice = 200000;
        leastpriceurl = "";
        for(i=0;i<products.length-1;i++)
        {
        if(products[i]["name"]!=""&&products[i]["price"]!="")
        {
            count+=1;
         fdata += '<div class="products"> <a target="_blank" href="'+'https://www.flipkart.com'+products[i]["productUrl"]+'">'
            +'<img src="'+products[i]["imageUrl"]+'" alt="'+products[i]["name"]+'" height="" width=""><br>'
            +'<span class = "price">'+products[i]["price"]+'</span>'+'<span class = "name">'
            +products[i]["name"]+'</span>'+'</a></div>';
        if((leastprice>=parseInt((products[i]["price"].split("₹")[1]).replaceAll(",","")))&&(parseInt((products[i]["price"].split("₹")[1]).replaceAll(",",""))>=minprice))
        {
            leastprice = parseInt((products[i]["price"].split("₹")[1]).replaceAll(",",""));
            leastpricepricename = products[i]["name"];
            leastpriceurl = 'https://www.flipkart.com' + products[i]["productUrl"];
            leastpriceimg = products[i]["imageUrl"];
        }
        }
        }
        fdata +="</div>"
        document.getElementById("product-list-flipkart").innerHTML = fdata;
        if(count==0)
        {
            document.getElementById("flipkart").innerHTML = "<h1 style='text-align:center;margin-left:15%;'>No Products Available please try again later</h1>";
        }

        console.log(leastprice);
        if(parseInt(""+leastprice)!=200000)
        {
            document.getElementById("bestflipkart").innerHTML = '<div class="products" style="margin-left: 50px;'
            +'margin-top: 20px;"'
            +'> <a target="_blank" href="'+leastpriceurl+'">'
            +'<img src="'+leastpriceimg+'" alt="'+leastpricepricename+'" height="" width=""><br>'
            +'<span class = "name">'+leastpricepricename+'</span>'
            +'<span class = "price">'+"&#8377;"+leastprice+'</span>'
            +'</a></div>';
        }
        else
        {
            document.getElementById("bestflipkart").innerHTML = '<h1 style="margin-top: 60px;margin-left: 20px;">No products</h1>'; 
        }

    });

    
    extractProductDetailsebay(e_url).then(products => {
        edata = '<h1>EBAY</h1><div id="E-bay" class="E-bay">';
        let count = 0;
        leastprice = 200000;
        for(i=1;i<products.length-1;i++)
        {
            count+=1;
        if(products[i]["name"]!=""&&products[i]["price"]!=""&&products[i]["price"].split("$")[1]*80>minprice)       
        {
         edata += '<div class="products"> <a target="_blank" href="'+products[i]["productUrl"]+'">'
            +'<img src="'+products[i]["imageUrl"]+'" alt="'+products[i]["name"]+'" height="" width=""><br>'
            +'<span class = "name">'+products[i]["name"]+'</span>'
            +'<span class = "price">'+"&#8377;"+(products[i]["price"].split("$")[1]*coverstion_rate_inr_to_usd).toFixed(2)+'</span>'
    +'</a></div>';

        //console.log("leastprice : "+leastprice+"   product price: "+parseFloat((products[i]["price"].split("$")[1]).replaceAll(",","")));
        if(parseFloat((products[i]["price"].split("$")[1]).replaceAll(",",""))<parseFloat(""+leastprice)&&(parseFloat((products[i]["price"].split("$")[1]).replaceAll(",",""))*coverstion_rate_inr_to_usd>minprice))
            {
                leastprice = parseFloat((products[i]["price"].split("$")[1]).replaceAll(",",""));
                leastpricepricename = products[i]["name"];
                leastpriceurl = products[i]["productUrl"];
                leastpriceimg = products[i]["imageUrl"];
            }

        }
        }
        edata +="</div>";
        document.getElementById("product-list-ebay").innerHTML = edata;
        if(count==0)
        {
            document.getElementById("E-bay").innerHTML = "<h1 style='text-align:center;margin-left:15%;'>No Products Available please try again later</h1>";
        }

        if(leastprice!=200000)
        {
            document.getElementById("bestebay").innerHTML = '<div class="products" style="margin-left: 50px;'
            +'margin-top: 20px;"'
            +'> <a target="_blank" href="'+leastpriceurl+'">'
            +'<img src="'+leastpriceimg+'" alt="'+leastpricepricename+'" height="" width=""><br>'
            +'<span class = "name">'+leastpricepricename+'</span>'
            +'<span class = "price">'+"&#8377;"+(leastprice*coverstion_rate_inr_to_usd).toFixed(0)+'</span>'
            +'</a></div>';
        }
        else
        {
            document.getElementById("bestebay").innerHTML = '<h1 style="margin-top: 60px;margin-left: 20px;">No products</h1>'; 
        }

    });
}

scrape();