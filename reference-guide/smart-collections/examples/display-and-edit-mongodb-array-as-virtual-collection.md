# Display and edit MongoDB array as virtual collection

**Context**: As a user I want to be able to see for a document as related data the objects within an array.

**Example**: I have a model `artists` that has an array of objects called `images`. I want to display the images as records of a collection related to the artists.

{% embed url="https://www.loom.com/share/82adfacc140b4e16b068ee8f40458e02" %}

In order to handle this, we used virtual (smart) collections as described below.

## Implementation

### Declaring a virtual (smart) collection of artistImages

First you need to declare a collection `artistImages` for which the records will be `images` objects from the `artists` collection. This will allow us to display in a user-friendly way the images.

We will do this in a `forest/artist-images.js` file.

```jsx
const { collection } = require('forest-express-mongoose');

collection('artistImages', {
  actions: [],
  fields: [{
    field: 'type',
    type: 'String',
  }, {
    field: 'isPrimary',
    type: 'Boolean',
  }, {
    field: 'url',
    type: 'String',
  }, {
    field: 'source',
    type: 'String',
  }],
  segments: [],
});
```

### Declaring a virtual hasMany relationship between the artists and artistImages

In order to view for each artist his artistImages as related data, you need to add this to the `forest/artists.js` file.

```jsx
const { collection } = require('forest-express-mongoose');

collection('artists', {
  actions: [],
  fields: [{
    field: 'artistImages',
    type: ['String'],
    reference: 'artistImages.id',
  }],
  segments: [],
});
```

### Defining the routes to retrieve artistImages

In order to fetch the artistImages of an artist, you need to implement the relationship route called when displaying the related data of an artist. This is done in the `routes/artists.js` file.

```jsx
const express = require('express');
const { PermissionMiddlewareCreator, RecordGetter, RecordSerializer } = require('forest-express-mongoose');
const { artists } = require('../models');

const router = express.Router();
const permissionMiddlewareCreator = new PermissionMiddlewareCreator('artists');

const artistImagesSerializer = new RecordSerializer({ modelName: 'artistImages' });
const artistsRecordGetter = new RecordGetter(artists);

router.get('/artists/:recordId/relationships/artistImages', permissionMiddlewareCreator.details(), (request, response, next) => {
  const { recordId } = request.params;
  artistsRecordGetter.get(recordId)
    .then((record) => {
      record.images.forEach((image, index) => image.id = `${recordId}/${index}`);
      return artistImagesSerializer.serialize(record.images);
    })
    .then((artistImagesSerialized) => response.send({ ...artistImagesSerialized, meta: { count: artistImagesSerialized.data.length } }))
    .catch(next);
});
```

### Defining the route to get a single artistImage (view details)

In the `routes/artist-images.js` file, you can add the following route to retrieve the relevant artistImage.

```jsx
const express = require('express');
const { PermissionMiddlewareCreator, RecordSerializer } = require('forest-express-mongoose');
const { artists } = require('../models');

const router = express.Router();
const permissionMiddlewareCreator = new PermissionMiddlewareCreator('artistImages');

const artistImagesSerializer = new RecordSerializer({ modelName: 'artistImages' });

// Get an artist image

router.get('/artistImages/:recordId', permissionMiddlewareCreator.details(), (request, response, next) => {
  const { recordId } = request.params;
  const artistContext = recordId.split('/');
  artists.findById(artistContext[0]).then((record) => {
    const artistImage = record.images[artistContext[1]];
    return artistImagesSerializer.serialize(artistImage);
  }).then(artistImageSerialized => {
    artistImageSerialized.data.id = recordId;
    return response.send(artistImageSerialized);
  });
});
```

### Editing an artistImage

In order to allow a user to edit the artistImage we need to add a put/ route as described below in the same `routes/artist-images.js` file.

```javascript
function updateImage(object, setters) {
  Object.entries(setters).forEach(([key, value]) => {
    object[key] = value;
  });
}

// Update an artist image

router.put('/artistImages/:recordId', permissionMiddlewareCreator.update(), (request, response, next) => {
  const artistContext = request.body.data.id.split('/');
  const { attributes } = request.body.data;
  const artistId = artistContext[0];
  const imageIndex = artistContext[1];
  artists.findById(artistId).then((record) => {
    updateImage(record.images[imageIndex], attributes);
    return record.save();
  }).then((artistUpdated) => artistImagesSerializer.serialize(artistUpdated.images[imageIndex]))
    .then((artistImageSerialized) => {
      artistImageSerialized.data.id = request.body.data.id;
      response.send(artistImageSerialized);
    })
    .catch(next);
});
```
