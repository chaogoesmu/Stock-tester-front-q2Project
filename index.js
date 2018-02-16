
const backend="http://localhost:3000";
const stockAPI="https://api.iextrading.com/1.0/";//GET /stock/{symbol}/price
let userToken = "";


//lets validate the user
//TODO: do this for reals.
axios.post(backend+'/login', { username: 'userTest', password: 'Password' })
  .then(response=>{
    userToken += response.data;
    alert('thank you for logging in '+'userTest');
    updateAll();
  });

function userUpdate()
{
  //TODO: have this actually update based on the user.
  let d_username = document.querySelector('.userName');
  d_username.innerHTML = 'userTest';
  let d_userFunds = document.querySelector('.userFunds');
  //console.log(`${backend}/${userToken}/funds`);
  axios.get(`${backend}/${userToken}/funds`)
  .then(response=>{
    d_userFunds.innerHTML = response.data;
  })
}

function inventoryUpdate()
{
  let d_dataDump = document.querySelector('.dataDump');
  axios.get(`${backend}/${userToken}/trades`)
  .then(response=>{
    //console.log(response.data);
    //TODO: unload this to the database to return only the totals
    let totals=[]
    response.data.forEach(x=>{
      //check if exists in totals
      //if it exists in totals += the totals
      //NOTE: you can go negative in stocks. That's bad m'kay?
      let location = totals.findIndex(y=>y.stock===x.symbol)
      if(location>=0)
      {
        totals[location].total+=x.amount;
        totals[location].totalval+=x.amount*x.value;
      }
      else {
        totals.push({stock:x.symbol, total:x.amount, totalval:x.amount*x.value})
      }
    })
    let sOut = '';
    let value = totals.map(x=>{
    return axios.get(route('stock',x.stock,"price"))
    })
    axios.all(value)
    .then(x=>{
      let i=0;
      x.forEach(y=>{
        if(totals[i].total>0)
        {
          sOut+=`stock: ${totals[i].stock} / amount: ${totals[i].total} / paid: ${Math.round((totals[i].totalval / totals[i].total) * 1000) / 1000}/ price: ${y.data} / value: ${totals[i].total*y.data} <input type="button" value="buy/sell" onclick="buyStuff('${totals[i].stock}')"></button><input type="button" value="review" onclick="showHistory('${totals[i].stock}')"></button></br> `
        }
        i++;
      })
      d_dataDump.innerHTML = sOut;
    })
    .catch(x=>{
      console.log(x)
    })

  })
}

function purchase(stock, amount, cost)
{
  axios.post(`${backend}/${userToken}/${stock}/trade`,{cost:cost,amount:amount})
  .then(x=>{
    updateAll();
  })
  .catch(x=>console.log(x));
}

function buyStuff(symbol = document.querySelector('.stockInput').value)
{
  let amount = prompt("how much to buy?","1")
  axios.get(route('stock',symbol,"price"))
  .then(x=>{
    purchase(symbol, amount, x.data)
  })
}

function searchStock()
{
  let d_stockInput = document.querySelector('.stockInput');
  let d_stockOut = document.querySelector('.stockOut');
  axios.get(route('stock',d_stockInput.value,"price"))
  .then(x=>{
    //template literal has issues...
    d_stockOut.innerHTML = `${d_stockInput.value} / price: ${x.data} <input type="button" value="buy/sell" onclick="buyStuff()"></button>`;
  })
  .catch({

  })
}

//`<a href="#" onclick="test('${}')">`

//TODO: finish this
function searchButton()
{
  let d_stockInput = document.querySelector('.stockInput');
  searchStock()
}

function updateAll()
{
  //get dataDump
  //list all the stocks there
  //list all their prices
  //profit?
  userUpdate();
  inventoryUpdate();
  let d_stockInput = document.querySelector('.stockInput');
  let d_stockTrigger = document.querySelector('.stockTrigger');
  d_stockTrigger.addEventListener("click", function(){
    searchButton();
});
}

/*
"amount": 5,
"id": 6,
"symbol": "cefl",
"tradetime": null,
"uid": 1,
"value": 16.44

*/
function showHistory(symbol)
{
  axios.get(`${backend}/${userToken}/${symbol}`)
  .then(x=>{
    console.log(x);
    let d_dataDump = document.querySelector('.dataDump');
    d_dataDump.innerHTML =x.data.reduce((acc,curr)=>{
          return acc +=`Trade Time(future release):${curr.tradetime} | Amount bought/sold: ${curr.amount} | Amount per share:${curr.value}</br>`;
        },'');
  })
}



//setup everything.

//TODO:route creator... need to rethink this
function route(...etc)
{
  etc.unshift(stockAPI);
  let sOut = etc.reduce((acc, curr)=>acc+=curr+'/');
  return sOut;
}


/*

// Requests will be executed in parallel...
axios.all([
    axios.get('https://api.github.com/users/codeheaven-io');
    axios.get('https://api.github.com/users/codeheaven-io/repos')
  ])
  .then(axios.spread(function (userResponse, reposResponse) {
    //... but this callback will be executed only when both requests are complete.
    console.log('User', userResponse.data);
    console.log('Repositories', reposResponse.data);
  }));

*/
