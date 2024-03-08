{% hint style="warning" %}
Please be sure of your agent type and version and pick the right documentation accordingly.
{% endhint %}

{% tabs %}
{% tab title="Node.js" %}
{% hint style="danger" %}
This is the documentation of the `forest-express-sequelize` and `forest-express-mongoose` Node.js agents that will soon reach end-of-support.

`forest-express-sequelize` v9 and `forest-express-mongoose` v9 are replaced by [`@forestadmin/agent`](https://docs.forestadmin.com/developer-guide-agents-nodejs/) v1.

Please check your agent type and version and read on or switch to the right documentation.
{% endhint %}
{% endtab %}

{% tab title="Ruby on Rails" %}
{% hint style="success" %}
This is still the latest Ruby on Rails documentation of the `forest_liana` agent, you’re at the right place, please read on.
{% endhint %}
{% endtab %}

{% tab title="Python" %}
{% hint style="danger" %}
This is the documentation of the `django-forestadmin` Django agent that will soon reach end-of-support.

If you’re using a Django agent, notice that `django-forestadmin` v1 is replaced by [`forestadmin-agent-django`](https://docs.forestadmin.com/developer-guide-agents-python) v1.

If you’re using a Flask agent, go to the [`forestadmin-agent-flask`](https://docs.forestadmin.com/developer-guide-agents-python) v1 documentation.

Please check your agent type and version and read on or switch to the right documentation.
{% endhint %}
{% endtab %}

{% tab title="PHP" %}
{% hint style="danger" %}
This is the documentation of the `forestadmin/laravel-forestadmin` Laravel agent that will soon reach end-of-support.

If you’re using a Laravel agent, notice that `forestadmin/laravel-forestadmin` v1 is replaced by [`forestadmin/laravel-forestadmin`](https://docs.forestadmin.com/developer-guide-agents-php) v3.

If you’re using a Symfony agent, go to the [`forestadmin/symfony-forestadmin`](https://docs.forestadmin.com/developer-guide-agents-php) v1 documentation.

Please check your agent type and version and read on or switch to the right documentation.
{% endhint %}
{% endtab %}
{% endtabs %}

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
  return s3Bucket.getSignedUrl('getObject', {
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
