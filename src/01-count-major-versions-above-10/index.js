/**
 * Make the following POST request with either axios or node-fetch:

POST url: http://ambush-api.inyourarea.co.uk/ambush/intercept
BODY: {
    "url": "https://api.npms.io/v2/search/suggestions?q=react",
    "method": "GET",
    "return_payload": true
}

 *******

The results should have this structure:
{
    "status": 200.0,
    "location": [
      ...
    ],
    "from": "CACHE",
    "content": [
      ...
    ]
}

 ******

 *  With the results from this request, inside "content", count
 *  the number of packages that have a MAJOR semver version 
 *  greater than 10.x.x
 */

const fetch = require('node-fetch');

//prettier-ignore
const body = {
  "url": "https://api.npms.io/v2/search/suggestions?q=react",
  "method": "GET",
  "return_payload": true
};

const countMajorVer = content => {
  const verAbove10 = content.filter(item => {
    const version = item.package.version;
    const firstNum = version.split('.')[0];
    return firstNum > 10;
  });
  return verAbove10.length;
};

module.exports = async function countMajorVersionsAbove10() {
  const count = fetch('http://ambush-api.inyourarea.co.uk/ambush/intercept', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
    .then(res => res.json())
    .then(data => countMajorVer(data.content))
    .catch(err => console.error(err));
  return count;
};
