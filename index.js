
const backend="http://localhost:3000";
const stockAPI="https://api.iextrading.com/1.0/";//GET /stock/{symbol}/price
let userToken = "";


//lets validate the user
//TODO: do this for reals.
axios.post(backend+'/login', { username: 'userTest', password: 'Password' })
  .then(response=>{
    userToken += response.data;
    console.log(userToken);
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
    console.log(response.data);
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
      }
      else {
        totals.push({stock:x.symbol, total:x.amount})
      }
    })
    console.log(totals);
    let sOut = '';
    let value = totals.map(x=>{
      return axios.get(route('stock',x.stock,"price"))
    })
    axios.all(value)
    .then(x=>{
      let i=0;
      x.forEach(y=>{
        sOut+=`stock: ${totals[i].stock} / amount: ${totals[i].total} / price: ${y.data} / value: ${totals[i].total*y.data}</br>`
        i++;
      })
      d_dataDump.innerHTML = sOut;
    })
    .catch(x=>{
      console.log(x);
    })

  })
  .catch(x=>{
    console.log(x);
  })
}

function purchase(stock, amount, cost)
{
  //'/:token/:stockSymbol/trade'
  //amount:req.body.amount,
  //value:req.body.cost
  axios.post(`${backend}/${userToken}/${stock}/trade`,{cost:cost,amount:amount})
  .then(x=>{
    updateAll();
  })
  .catch(x=>console.log(x));
}

function buyStuff()
{
  let d_stockInput = document.querySelector('.stockInput');
  let amount = prompt("how much to buy?","1")
  axios.get(route('stock',d_stockInput.value,"price"))
  .then(x=>{
    purchase(d_stockInput.value, amount, x.data)
  })
}

function searchButton()
{
  let d_stockInput = document.querySelector('.stockInput');
  let d_stockOut = document.querySelector('.stockOut');
  axios.get(route('stock',d_stockInput.value,"price"))
  .then(x=>{
    d_stockOut.innerHTML = `${d_stockInput.value} / price: ${x.data} <input type="button" value="buy/sell" onclick="buyStuff()"></button>`;
  })
  .catch({

  })
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

//setup everything.

//TODO:route creator... need to rethink this
function route(...etc)
{
  etc.unshift(stockAPI);
  let sOut = etc.reduce((acc, curr)=>acc+=curr+'/');
  console.log(sOut);
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
