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

 * With the results from this request, inside "content", 
 * list every maintainer and each package name that they maintain,
 * return an array with the following shape:
[
    ...
    {
        username: "a-username",
        packageNames: ["a-package-name", "another-package"]
    }
    ...
]
 * NOTE: the parent array and each "packageNames" array should 
 * be in alphabetical order.
 */

const fetch = require('node-fetch');

//prettier-ignore
const body = {
  "url": "https://api.npms.io/v2/search/suggestions?q=react",
  "method": "GET",
  "return_payload": true
}

const arrangeMaintainers = content => {
  let maintainerList = [];
  content.forEach(item => {
    const { name: packageName, maintainers } = item.package;
    maintainers.forEach(user => {
      const userObject = maintainerList.find(
        ({ username }) => username === user.username,
      );
      if (!userObject)
        maintainerList.push({
          username: user.username,
          packageNames: [packageName],
        });
      if (userObject) {
        const packageList = userObject.packageNames;
        packageList.push(packageName);
        packageList.sort();
      }
    });
  });
  const sortedList = maintainerList.sort((a, b) =>
    a.username > b.username ? 1 : -1,
  );
  return sortedList;
};

module.exports = async function organiseMaintainers() {
  const maintainers = fetch(
    'http://ambush-api.inyourarea.co.uk/ambush/intercept',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    },
  )
    .then(res => res.json())
    .then(data => arrangeMaintainers(data.content))
    .catch(err => console.error(err));

  return maintainers;
};
