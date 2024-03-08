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

# Send Smart Action notifications to Slack

This example shows you how to integrate [Slack incoming webhooks](https://api.slack.com/messaging/webhooks) to receive notifications in your workspace when a Smart Action e.g `"Reject application"` is triggered.

{% embed url="https://www.loom.com/share/67fc3cfddcf04fa9b56bd6b9de3dc315" %}
Demo
{% endembed %}

## Create your Forest Admin slack app

Follow Slack's guide to [create a new app](https://api.slack.com/messaging/webhooks) in your workspace and start sending messages using Incoming Webhooks.

![](<../../../.gitbook/assets/image (527).png>)

At the end of this guide, make sure your Slack app has the following features activated:&#x20;

- Incoming Webhooks
- Interactive Components
- Bots
- Permissions

![](<../../../.gitbook/assets/image (506).png>)

Once your Slack app has its shiny Incoming Webhook URL, you will be able to send your [message](https://api.slack.com/messages) in JSON as the body of an `application/json` POST request.

```
https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX
```

## Connect your app from a Slack channel of your choice

![](<../../../.gitbook/assets/image (485).png>)

## Set up the webhook from your admin backend

### Install the [node.js Slack SDK](https://slack.dev/node-slack-sdk)

From your project's directory, simply run&#x20;

```bash
$ npm install --save @slack/webhook
```

### Add the Incoming Webhook URL to your .env

```bash
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX
```

{% hint style="warning" %}
This Incoming Webhook URL contains a secret key, please make sure it does not appear in your code.
{% endhint %}

### Create the Smart Action and initialize the Incoming Webhook

#### Smart Action declaration

{% code title="forest/companies.js" %}

```javascript
const { collection } = require('forest-express-sequelize');

// This file allows you to add to your Forest UI:
// - Smart actions: https://docs.forestadmin.com/documentation/reference-guide/actions/create-and-manage-smart-actions
// - Smart fields: https://docs.forestadmin.com/documentation/reference-guide/fields/create-and-manage-smart-fields
// - Smart relationships: https://docs.forestadmin.com/documentation/reference-guide/relationships/create-a-smart-relationship
// - Smart segments: https://docs.forestadmin.com/documentation/reference-guide/segments/smart-segments
collection('companies', {
  actions: [
    {
      name: 'Reject application',
      type: 'single',
      fields: [
        {
          field: 'Reason(s) for rejection',
          description: 'Please provide a reason for this decision',
          type: ['Enum'],
          enums: [
            'Certificate of Incorporation',
            'Proof of Address ID',
            'Bank Statement ID',
          ],
          required: true,
        },
        {
          field: 'Comment',
          description:
            'This comment will only be displayed in your slack workspace message',
          type: 'String',
          widget: 'text area',
        },
      ],
    },
  ],
  // ...
});
```

{% endcode %}

#### Smart Action logic

{% code title="routes/companies.js" %}

```javascript
const express = require('express');
const {
  PermissionMiddlewareCreator,
  RecordsGetter,
} = require('forest-express-sequelize');
const { IncomingWebhook } = require('@slack/webhook');
const { companies } = require('../models');

const router = express.Router();
const permissionMiddlewareCreator = new PermissionMiddlewareCreator(
  'companies'
);
const url = process.env.SLACK_WEBHOOK_URL;

// This file contains the logic of every route in Forest Admin for the collection companies:
// - Native routes are already generated but can be extended/overridden - Learn how to extend a route here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/routes/extend-a-route
// - Smart action routes will need to be added as you create new Smart Actions - Learn how to create a Smart Action here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/actions/create-and-manage-smart-actions

// ...

// Initialize webhook
const webhook = new IncomingWebhook(url);

router.post(
  '/actions/reject-application',
  permissionMiddlewareCreator.smartAction(),
  async (request, response) => {
    // Get input form attributes
    const attributes = await request.body.data.attributes.values;
    const rejectionReason = attributes['Reason(s) for rejection'];
    const comment = attributes['Comment'];

    // Get selected company
    const [selectedCompanyId] = await new RecordsGetter(
      companies,
      request.user,
      request.query
    ).getIdsFromRequest(request);
    const selectedCompany = await companies.findByPk(selectedCompanyId);

    // Change company status to rejected
    await companies.update(
      { status: 'rejected' },
      { where: { id: selectedCompanyId } }
    );
    response.send({ success: "Company's request to go live rejected!" });

    // Trigger Slack webhook
    await webhook.send({
      text: 'An action has been triggered from Forest Admin',
      channel: 'C01CFGCADGF', // replace by your Slack channel ID
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: 'Action triggered - Company application rejected :x:',
            emoji: true,
          },
        },
        {
          type: 'divider',
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `${request.user.firstName} ${request.user.lastName} just rejected <https://app.forestadmin.com/Live-demo/Production/Operations/data/companies/index/record/companies/${selectedCompanyId}/summary|${selectedCompany.name}>'s request to go live!\n\n • *Reason for rejection:* ${rejectionReason[0]}\n • *Comment:* ${comment}`,
          },
          accessory: {
            type: 'image',
            image_url: `${selectedCompany.logoUrl}`,
            alt_text: 'company logo',
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: 'For more details on the company',
          },
          accessory: {
            type: 'button',
            text: {
              type: 'plain_text',
              text: 'View Notes',
              emoji: true,
            },
            value: 'null',
            url: `https://app.forestadmin.com/Live-demo/Production/Operations/data/companies/index/record/companies/${selectedCompanyId}/collaboration`,
            action_id: 'button-action',
          },
        },
      ],
    });
  }
);

module.exports = router;
```

{% endcode %}

{% hint style="info" %}
To learn more about composing messages using the Slack API, please visit the

- Slack Interactive messages [guide](https://api.slack.com/messaging/interactivity)
- Slack Block Kit [visual builder](https://api.slack.com/tools/block-kit-builder)
  {% endhint %}

{% hint style="warning" %}
To learn more about error handling of Slack Interactive Webhooks, please visit the Slack [changelog](https://api.slack.com/changelog/2016-05-17-changes-to-errors-for-incoming-webhooks).
{% endhint %}
