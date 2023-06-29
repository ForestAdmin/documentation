---
description: >-
  this example shows how to call a third party webhook like n8n, make or zapier…
---

# Call a n8n webhook

### Requirements

* An admin backend running on `forest-express-sequelize`

## How it works

### Directory: **/forest**

Create a new smart action in the forest file of the collection with the **hasMany relationship** (organizations in this example).

This smart action will be usable on a single record (`type: 'single'`). We will create two fields in the smart action form, one will be used for the **search** on the referenced collection and the second will be used to see the **selection** made by the operator.

```javascript
const a = 0;
```