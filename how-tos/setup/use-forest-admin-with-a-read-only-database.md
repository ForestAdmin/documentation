{% hint style="warning" %}
VERSION WARNING TEST
{% endhint %}

# Use Forest Admin with a read-only database

Although you'd be denying yourself some native features of Forest Admin (CRUD), this may be mandatory for you because of your project's architecture or security requirements.

{% hint style="info" %}
If you only want _some_ fields to be read-only, check out [this section](https://docs.forestadmin.com/user-guide/collections/customize-your-fields#basic-settings).
{% endhint %}

To set up Forest Admin with a read-only database, follow those steps:

### Step 1: set all your collections as read-only

A collection can be set as read-only from its settings, accessible using the Layout Editor mode:

You must **disable all permissions** there, as described in [this section](https://docs.forestadmin.com/user-guide/project-settings/teams-and-users/manage-roles#collection-permissions-1).

{% hint style="warning" %}
Repeat this for each of your collections.
{% endhint %}

### Step 2 (optional): interact with your data using Smart Actions

At this point, your Forest interface allows you only to browse your data and not interact with it.

You still have the opportunity to interact with your data according to your processes with a little coding:

{% content-ref url="../../reference-guide/actions/create-and-manage-smart-actions/" %}
[create-and-manage-smart-actions](../../reference-guide/actions/create-and-manage-smart-actions/)
{% endcontent-ref %}
