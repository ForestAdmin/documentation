---
description: >-
  this example shows how to bulk anonymize users
---
# Anonymize users in bulk
As usual, you must declare the action on your collection. You can then implement the post action as you need. Here the records are simply updated in bulk through the `sequelize` ORM.

{% code title="forest/users.js" %}
```javascript
// forest/users.js
const Liana = require('forest-express-sequelize');

Liana.collection('users', {
  actions: [{
    name: 'Anonymize',
    type: 'single',
  }]
});

```
{% endcode %}

{% code title="routes/users.js" %}
```javascript
// routes/users.js
const express = require('express');
const router = express.Router();
const models = require('../models');
const {
  ensureAuthenticated,
  RecordsGetter,
} = require('forest-express-sequelize');

router.post(
  '/actions/anonymize',
  ensureAuthenticated,
  parseRequestBody,
  async (request, response) => {
    const { query, user } = request;
    const recordsGetter = new RecordsGetter(models.user, user, query);
    const records = await recordsGetter.getAll();

    try {
      await models.user.update(
        { firstName: '*** Anonymized First Name ***', lastName: '*** Anonymized Last Name ***' },
        { where: { id: records.map(record => record.id) } },
      );
      response.send({ success: 'User(s) anonymized' });
    } catch (e) {
      return response
        .status(400)
        .send({ error: `Failure during user anonymization: ${e.message}` });
    }
  },
);

module.exports = router;
```
{% endcode %}
