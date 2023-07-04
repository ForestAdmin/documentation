---
description: >-
  This example shows how to call a third party webhook/automation tool like n8n, make or zapier…
---
# Call a n8n webhook
You need to declare the new action with its scope in the `users.js` model
{% code title="forest/users.js" %}
```javascript
// forest/users.js
const Liana = require('forest-express-sequelize');

Liana.collection('users', {
  actions: [{
    name: 'Notify with slack',
    type: 'single',
  }]
});
```
{% endcode %}

Then implement the action as needed in the route route action:
{% code title="routes/users.js" %}
```javascript
// routes/users.js
const express = require('express');
const router = express.Router();
const Liana = require('forest-express-sequelize');
const models = require('../models');

const Liana = require('forest-express-sequelize');
const superagent = require('superagent');

router.post('/actions/notify-with-slack', Liana.ensureAuthenticated, async (request, response) => {
  const { query, user } = request;
  const [userId] = await new RecordsGetter(models.user, user, query).getIdsFromRequest(request);

  try {
    await superagent.post('https://user.app.nn.cloud/webhook/123456/abcde/').send({ userId });
    response.send({ success: 'Called webhook' });
  } catch (e) {
    return response.status(400).send({ error: `Failure calling webhook: ${e.message}` });
  }
});

module.exports = router;
```
{% endcode %}
