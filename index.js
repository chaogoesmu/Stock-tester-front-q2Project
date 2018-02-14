
const backend="http://localhost:3000";
const stockAPI="https://api.iextrading.com/1.0/";//GET /stock/{symbol}/price
let userToken = "";


//lets validate the user
//TODO: do this for reals.
axios.post(backend+'/login', { username: 'userTest', password: 'Password' })
  .then(function(response){
    userToken += response.data;
    userUpdate()
    alert('thank you for logging in '+'userTest');
  });

function userUpdate()
{
  //TODO: have this actually update based on the user.
  let d_username = document.querySelector('.userName');
  d_username.innerHTML = 'userTest';
  let d_userFunds = document.querySelector('.userFunds');
  d_userFunds.innerHTML = '50,000';
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
