# Create a Smart Collection with Amazon S3

### Creating the Smart Collection <a href="#creating-a-smart-collection" id="creating-a-smart-collection"></a>

On our Live Demo, we’ve stored the `Legal Documents` of a `Company` on Amazon S3. In the following example, we show you how to create the Smart Collection to see and manipulate them in your Forest admin.

{% tabs %}
{% tab title="SQL" %}
First, we declare the `legal_docs` collection in the `forest/` directory. In this Smart Collection, all fields are related to S3 attributes except the field `is_verified` that is stored on our database in the collection `documents`.&#x20;

You can check out the list of [available field options ](../../smart-fields/#available-field-options)if you need it.

{% hint style="warning" %}
You **MUST** declare an `id` field when creating a Smart Collection. The value of this field for each record **MUST** be unique. On the following example, we simply generate a random UUID.
{% endhint %}

{% code title="/forest/legal_docs.js" %}
```javascript
const { collection } = require('forest-express-sequelize');
const models = require('../models');

collection('legal_docs', {
  fields: [{ 
    field: 'id', 
    type: 'String' 
  }, { 
    field: 'url', 
    type: 'String', 
    widget: 'link',
    isReadOnly: true
  }, { 
    field: 'last_modified', 
    type: 'Date',
    isReadOnly: true
  }, { 
    field: 'size', 
    type: 'String',
    isReadOnly: true
  }, {
    field: 'is_verified', 
    type: 'Boolean',
    isReadOnly: false
  }]
});
```
{% endcode %}
{% endtab %}

{% tab title="Mongodb" %}
First, we declare the `legal_docs` collection in the `forest/` directory. In this Smart Collection, all fields are related to S3 attributes except the field `is_verified` that is stored on our database in the collection `documents`.&#x20;

You can check out the list of [available field options here ](../../smart-fields/#available-field-options)if you need it.

{% hint style="warning" %}
You **MUST** declare an `id` field when creating a Smart Collection. The value of this field for each record **MUST** be unique. On the following example, we simply generate a random UUID.
{% endhint %}

{% code title="/forest/legal_docs.js" %}
```javascript
const { collection } = require('forest-express-mongoose');
const models = require('../models');

collection('legal_docs', {
  fields: [{ 
    field: 'id', 
    type: 'String' 
  }, { 
    field: 'url', 
    type: 'String', 
    widget: 'link',
    isReadOnly: true
  }, { 
    field: 'last_modified', 
    type: 'Date',
    isReadOnly: true
  }, { 
    field: 'size', 
    type: 'String',
    isReadOnly: true
  }, {
    field: 'is_verified', 
    type: 'Boolean',
    isReadOnly: false
  }]
});
```
{% endcode %}
{% endtab %}
{% endtabs %}

{% hint style="info" %}
You can add the option `isSearchable: true` to your collection to display the search bar. Note that you will have to implement the search yourself by including it into your own `get` logic.
{% endhint %}

### Implementing the GET (all records) <a href="#implementing-the-get-all-records" id="implementing-the-get-all-records"></a>

At this time, there’s no Smart Collection Implementation because no route in your admin backend handles the API call yet.&#x20;

{% tabs %}
{% tab title="SQL" %}
In the file `routes/legal_docs.js`, we’ve created a new route to implement the API behind the Smart Collection.

The logic here is to list all the files uploaded on a specific S3 Bucket. We use a custom service `services/s3-helper.js` for this example. The implementation code of this service is [available on Github](https://github.com/ForestAdmin/forest-live-demo-lumber/blob/master/services/s3-helper.js).

Finally, the last step is to serialize the response data in the expected format which is simply a standard [JSON API](http://jsonapi.org/) document. We use the very simple [JSON API Serializer](https://github.com/SeyZ/jsonapi-serializer) library for this task.

{% code title="/routes/legal_docs.js" %}
```javascript
const P = require('bluebird');
const express = require('express');
const router = express.Router();
const models = require('../models');
const S3Helper = require('../services/s3-helper');
const Serializer = require('../serializers/legal_docs');

function reconcileData(file) {
  return models.documents
    .findOne({ where: { file_id: file.id }})
    .then((doc) => {
      file.is_verified = doc ? doc.is_verified : false;
      return file;
    });
}

router.get('/legal_docs', (req, res, next) => {
  return new S3Helper().files('livedemo/legal')
    .then((files) => P.mapSeries(files, (file) => reconcileData(file)))
    .then((files) => Serializer.serialize(files))
    .then((files) => res.send(files))
    .catch((err) => next(err));
});

module.exports = router;
```
{% endcode %}

{% code title="/serializers/legal_docs.js" %}
```javascript
const JSONAPISerializer = require('jsonapi-serializer').Serializer;

module.exports = new JSONAPISerializer('legal_docs', {
  attributes: ['url', 'last_modified', 'size', 'is_verified'],
  keyForAttribute: 'underscore_case'
});
```
{% endcode %}
{% endtab %}

{% tab title="Mongodb" %}
In the file `routes/legal_docs.js`, we’ve created a new route to implement the API behind the Smart Collection.

The logic here is to list all the files uploaded on a specific S3 Bucket. We use a custom service `services/s3-helper.js` for this example. The implementation code of this service is [available on Github](https://github.com/ForestAdmin/forest-live-demo-lumber/blob/master/services/s3-helper.js).

Finally, the last step is to serialize the response data in the expected format which is simply a standard [JSON API](http://jsonapi.org/) document. We use the very simple [JSON API Serializer](https://github.com/SeyZ/jsonapi-serializer) library for this task.

{% code title="/routes/legal_docs.js" %}
```javascript
const P = require('bluebird');
const express = require('express');
const router = express.Router();
const models = require('../models');
const S3Helper = require('../services/s3-helper');
const Serializer = require('../serializers/legal_docs');

function reconcileData(file) {
  return models.documents
    .findOne({ where: { file_id: file.id }})
    .then((doc) => {
      file.is_verified = doc ? doc.is_verified : false;
      return file;
    });
}

router.get('/legal_docs', (req, res, next) => {
  return new S3Helper().files('livedemo/legal')
    .then((files) => P.mapSeries(files, (file) => reconcileData(file)))
    .then((files) => Serializer.serialize(files))
    .then((files) => res.send(files))
    .catch((err) => next(err));
});

module.exports = router;
```
{% endcode %}

{% code title="/serializers/legal_docs.js" %}
```javascript
const JSONAPISerializer = require('jsonapi-serializer').Serializer;

module.exports = new JSONAPISerializer('legal_docs', {
  attributes: ['url', 'last_modified', 'size', 'is_verified'],
  keyForAttribute: 'underscore_case'
});
```
{% endcode %}


{% endtab %}
{% endtabs %}

![](<../../../.gitbook/assets/Capture d’écran 2019-07-01 à 10.40.14 (1).png>)

### Implementing the GET (specific record) <a href="#implementing-the-get-specific-record" id="implementing-the-get-specific-record"></a>

{% tabs %}
{% tab title="SQL" %}
To access the details view of a Smart Collection record, you have to catch the GET API call on a specific record. One more time, we use a custom service `services/s3-helper.js` that encapsulates the S3 business logic for this example.

The implementation of the `reconcileData()` and `Serializer.serialize()` functions are already described in the [Implementing the GET (all records)](../#implementing-the-get-all-records) section.

{% code title="/routes/legal_docs.js" %}
```javascript
const P = require('bluebird');
const express = require('express');
const router = express.Router();
const models = require('../models');
const S3Helper = require('../services/s3-helper');
const Serializer = require('../serializers/legal_docs');

// ...

router.get('/legal_docs/:doc_id', (req, res, next) => {
  return new S3Helper()
    .file(`livedemo/legal/${req.params.doc_id}`)
    .then((file) => reconcileData(file))
    .then((file) => Serializer.serialize(file))
    .then((file) => res.send(file))
    .catch((err) => next(err));
});

module.exports = router;
```
{% endcode %}
{% endtab %}

{% tab title="Mongodb" %}
To access the details view of a Smart Collection record, you have to catch the GET API call on a specific record. One more time, we use a custom service `services/s3-helper.js` that encapsulates the S3 business logic for this example.

The implementation of the `reconcileData()` and `Serializer.serialize()` functions are already described in the [Implementing the GET (all records)](../#implementing-the-get-all-records) section.

{% code title="/routes/legal_docs.js" %}
```javascript
const P = require('bluebird');
const express = require('express');
const router = express.Router();
const models = require('../models');
const S3Helper = require('../services/s3-helper');
const Serializer = require('../serializers/legal_docs');

// ...

router.get('/legal_docs/:doc_id', (req, res, next) => {
  return new S3Helper()
    .file(`livedemo/legal/${req.params.doc_id}`)
    .then((file) => reconcileData(file))
    .then((file) => Serializer.serialize(file))
    .then((file) => res.send(file))
    .catch((err) => next(err));
});

module.exports = router;
```
{% endcode %}


{% endtab %}
{% endtabs %}

![](<../../../.gitbook/assets/image (257).png>)

### Implementing the PUT <a href="#implementing-the-put" id="implementing-the-put"></a>

To handle the update of a record we have to catch the PUT API call. In our example, all S3-related fields are set as read-only and only `is_verified` can be updated.

{% tabs %}
{% tab title="SQL" %}
The implementation of the `reconcileData()` and `Serializer.serialize()` functions are already explained in the [Implementing the GET (all records)](../#implementing-the-get-all-records) section.

{% code title="/routes/legal_docs.js" %}
```javascript
const P = require('bluebird');
const express = require('express');
const router = express.Router();
const models = require('../models');
const S3Helper = require('../services/s3-helper');
const Serializer = require('../serializers/legal_docs');

// ...

router.put('/legal_docs/:doc_id', (req, res, next) => {
  return models.documents
    .findOne({ where: { file_id: req.params.doc_id }})
    .then((doc) => {
      doc.is_verified = req.body.data.attributes.is_verified;
      return doc.save();
    })
    .then(() => new S3Helper().file(`livedemo/legal/${req.params.doc_id}`))
    .then((file) => reconcileData(file))
    .then((file) => Serializer.serialize(file))
    .then((file) => res.send(file))
    .catch((err) => next(err));
});

module.exports = router;
```
{% endcode %}
{% endtab %}

{% tab title="Mongodb" %}
The implementation of the `reconcileData()` and `Serializer.serialize()` functions are already explained in the [Implementing the GET (all records)](../#implementing-the-get-all-records) section.

{% code title="/routes/legal_docs.js" %}
```javascript
const P = require('bluebird');
const express = require('express');
const router = express.Router();
const models = require('../models');
const S3Helper = require('../services/s3-helper');
const Serializer = require('../serializers/legal_docs');

// ...

router.put('/legal_docs/:doc_id', (req, res, next) => {
  return models.documents
    .findOne({ where: { file_id: req.params.doc_id }})
    .then((doc) => {
      doc.is_verified = req.body.data.attributes.is_verified;
      return doc.save();
    })
    .then(() => new S3Helper().file(`livedemo/legal/${req.params.doc_id}`))
    .then((file) => reconcileData(file))
    .then((file) => Serializer.serialize(file))
    .then((file) => res.send(file))
    .catch((err) => next(err));
});

module.exports = router;
```
{% endcode %}


{% endtab %}
{% endtabs %}

![](<../../../.gitbook/assets/Capture d’écran 2019-07-01 à 10.42.42.png>)

### Implementing the DELETE <a href="#implementing-the-delete" id="implementing-the-delete"></a>

Now we are able to see all the legal documents on Forest Admin, it’s time to implement the DELETE HTTP method in order to remove the documents on S3 when the admin user needs it.

{% tabs %}
{% tab title="SQL" %}
{% code title="/routes/legal_docs.js" %}
```javascript
const express = require('express');
const router = express.Router();
const S3Helper = require('../services/s3-helper');
const Serializer = require('../serializers/legal_docs');

// ...

router.delete('/legal_docs/:doc_id', (req, res, next) => {
  return new S3Helper()
    .deleteFile(`livedemo/legal/${req.params.doc_id}`)
    .then(() => res.status(204).send())
    .catch((err) => next(err));
});

module.exports = router;
```
{% endcode %}
{% endtab %}

{% tab title="Mongodb" %}
{% code title="/routes/legal_docs.js" %}
```javascript
const express = require('express');
const router = express.Router();
const S3Helper = require('../services/s3-helper');
const Serializer = require('../serializers/legal_docs');

// ...

router.delete('/legal_docs/:doc_id', (req, res, next) => {
  return new S3Helper()
    .deleteFile(`livedemo/legal/${req.params.doc_id}`)
    .then(() => res.status(204).send())
    .catch((err) => next(err));
});

module.exports = router;
```
{% endcode %}
{% endtab %}
{% endtabs %}

![](<../../../.gitbook/assets/Capture d’écran 2019-07-01 à 10.45.48.png>)

### Implementing the POST <a href="#implementing-the-post" id="implementing-the-post"></a>

On our Live Demo example, creating a record directly from this Smart Collection does not make any sense because the admin user will upload the legal docs in the company details view. For the documentation purpose, we catch the call and returns an appropriate error message to the admin user.

{% tabs %}
{% tab title="SQL" %}
{% code title="/routes/legal_docs.js" %}
```javascript
...

router.post('/legal_docs', permissionMiddlewareCreator.create(), (request, response) => {
  response.status(400).send('You cannot create legal documents from here. Please, upload them directly in the details view of a Company');
});

...

module.exports = router;
```
{% endcode %}
{% endtab %}

{% tab title="Mongodb" %}
{% code title="/routes/legal_docs.js" %}
```javascript
const P = require('bluebird');
const express = require('express');
const router = express.Router();
const models = require('../models');
const S3Helper = require('../services/s3-helper');
const Serializer = require('../serializers/legal_docs');

// ...

router.post('/legal_docs', (req, res, next) => {
  res.status(400).send('You cannot create legal documents from here. Please, upload them directly in the details view of a Company');
});

module.exports = router;
```
{% endcode %}
{% endtab %}
{% endtabs %}

![](<../../../.gitbook/assets/image (346).png>)
