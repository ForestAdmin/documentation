# Generate signed urls to display S3 files in a smart field

**Context**: As a user I want to be able to preview files from an S3 bucket thanks to secure signed urls.

![](<../../../.gitbook/assets/image (536).png>)

**Example**: I have a collection `places` that has a `pictures` field which is an array of strings containing the file name of files stored on a s3 bucket.

In a smart field called `s3pictures` I return the value of calls made to S3 to get signed urls for the files whose name is present in the `pictures` field.

### Implementation

First you need to implement the function to get the signed urls from s3. We use the `aws-sdk` npm package to connect to the bucket storing the pictures.

`services/s3-helper.js`

```jsx
const AWS = require('aws-sdk');

AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

function getS3SignedUrlById(fileId) {
  const s3Bucket = new AWS.S3({ params: { Bucket: process.env.S3_BUCKET } });
  return s3Bucket.getSignedUrl("getObject", {
    Key: fileId,
    Expires: 60 * process.env.AWS_S3_URL_EXPIRE_MINS,
  });
}

module.exports = getS3SignedUrlById;
```

Then you need to declare the `s3Pictures` smart field and implement the get logic to populate it. In the get function you iterate on the pictures array to get the signed url for each file name then return an array with the signed urls.

`forest/places.js`

```jsx
const { collection } = require('forest-express-sequelize');
const getSignedUrlById = require('../services/s3-helper');

collection('places', {
  actions: [],
  fields: [
    {
      field: 's3Pictures',
      type: ['String'],
      get: async (place) => {
        if (place.pictures) {
          const s3pictures = [];
          for (const picture of place.pictures) {
            const url = await getSignedUrlById(picture);
            s3pictures.push(url);
          }
          return s3pictures;
        }
        return null;
      },
    },
  ],
  segments: [],
});
```

You can then use the default file viewer widget settings to preview the pictures.
