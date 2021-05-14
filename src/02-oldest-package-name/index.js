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

 *  With the results from this request, inside "content", return
 *  the "name" of the package that has the oldest "date" value
 */

const fetch = require('node-fetch');

//prettier-ignore
const body = {
  "url": "https://api.npms.io/v2/search/suggestions?q=react",
  "method": "GET",
  "return_payload": true
}

const oldestName = content => {
  const packageInfo = {
    name: '',
    date: Date.now(),
  };
  content.forEach(item => {
    const date = Date.parse(item.package.date);
    const name = item.package.name;
    if (date < packageInfo.date) {
      packageInfo.name = name;
      packageInfo.date = date;
    }
  });
  return packageInfo.name;
};

module.exports = async function oldestPackageName() {
  const name = fetch('http://ambush-api.inyourarea.co.uk/ambush/intercept', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
    .then(res => res.json())
    .then(data => oldestName(data.content))
    .catch(err => console.error(err));
  return name;
};
