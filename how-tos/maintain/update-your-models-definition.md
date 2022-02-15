# Update your models' definition

Your database schema will evolve over time. Any changes can (and probably should) be applied to your admin backend's models.&#x20;

{% hint style="info" %}
To upgrade your models definition in your code you need to be at least in the V7 version of `forest-express-sequelize` or `forest-express-mongoose` package. If this is not the case please follow our [migration note](upgrade-notes-sql-mongodb/upgrade-to-v7.md).
{% endhint %}

Now you can use the `forest schema:update` commande to achieve your goal.

This command is able to create all the missing file for a newly added table in your database. However it will not automatically modify existing files. So if you just added a new field inside an existing table, please juste remove the corresponding model file inside your models folder and run the command.

### Examples

In the following example, we added a new table `customers` on an existing project. This is the output of the `forest schema:update` command.

```
$ forest schema:update
✓ Connecting to your database(s)
✓ Analyzing the database(s)
  create forest/customers.js
  skip forest/staffs.js - already exist.
  skip forest/stores.js - already exist.
  create models/customers.js
  skip models/staffs.js - already exist.
  skip models/stores.js - already exist.
  create routes/customers.js
  skip routes/staffs.js - already exist.
  skip routes/stores.js - already exist.
✓ Generating your files
```

In the next example we just removed a field from the previous added table. After removing the model file from the models folder. This is the output of the `forest schema:update` command.

```
$ forest schema:update
✓ Connecting to your database(s)
✓ Analyzing the database(s)
  skip forest/customers.js - already exist.
  skip forest/staffs.js - already exist.
  skip forest/stores.js - already exist.
  create models/customers.js
  skip models/staffs.js - already exist.
  skip models/stores.js - already exist.
  skip routes/customers.js - already exist.
  skip routes/staffs.js - already exist.
  skip routes/stores.js - already exist.
✓ Generating your files
```
