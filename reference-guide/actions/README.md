# Actions

Visualizing data is great, but at some point you're going to want to interact with it.

### What is an action? <a href="#what-is-an-action" id="what-is-an-action"></a>

An action is a button that triggers server-side logic through an API call. Without a single line of code, Forest Admin natively supports all common actions required on an admin interface such as CRUD (Create, Read, Update, Delete), sort, search, data export, and more.

### Native actions vs Smart Actions

In Forest Admin, all the available actions can fall into 2 categories.

#### Native actions

Those actions come out-of-the-box. We've covered them in details _from a route perspective_ in [Routes](../routes/), but here is what the most common ones look like in the interface:

* **Create**: create a new record in a given collection **(1)**
* **Duplicate**: create a new record from an existing one **(2)**
* **Update**: edit a record's data **(3)**
* **Delete**: remove a record **(4)**

![](<../../.gitbook/assets/Capture d’écran 2019-07-01 à 12.31.54.png>)

{% hint style="info" %}
Some actions are only available when 1+ record(s) are selected. This depends on [their type](./#triggering-different-types-of-actions).
{% endhint %}

![](<../../.gitbook/assets/Capture d’écran 2019-07-01 à 12.36.29.png>)

{% hint style="warning" %}
Native actions' **permissions** are set from each of your [collections' settings](broken-reference).
{% endhint %}

#### Smart Actions

Smart actions are your own business-related actions, built with your own code. You'll learn how to use them in the [following page](create-and-manage-smart-actions/#what-is-a-smart-action).

{% hint style="info" %}
Smart actions can be triggered from the _Actions_ button or directly from a [Summary view](broken-reference).
{% endhint %}

### Triggering different types of actions

Triggering an action is very simple, but the behavior can differ according to the type of action.

There are 3 types of actions :

* **Bulk** actions: the action will be available when you click on one or several desired records
* **Single** actions: the action is only available for one selected record at a time
* **Global** actions: the action is always available and will be executed on all records



In the following pages, we'll cover everything you need to know about interacting with your data through actions.
