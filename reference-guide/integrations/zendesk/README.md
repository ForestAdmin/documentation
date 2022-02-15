# Zendesk

For this example we will use the Zendesk API described [here](https://developer.zendesk.com/rest\_api/docs/support/introduction).&#x20;

We are going to use [Smart Collections](../../smart-collections/), [Smart Relationships](../../relationships/create-a-smart-relationship/), and [Smart Fields](../../smart-fields/) to implement such integration.

![](<../../../.gitbook/assets/image (481).png>)

{% hint style="success" %}
The full implementation of this integration is available [here](https://github.com/existenz31/forest-zendesk) on GitHub.
{% endhint %}

### Live Demo

{% embed url="https://www.loom.com/share/149112562d204ca49fbaf737afac78d0" %}

### Build your basic Admin Panel with Forest Admin

Let's start with a basic admin panel on top of a SQL database that has a table `Users` that holds an email address field.

![](<../../../.gitbook/assets/image (546).png>)

Now, let's build the Admin Panel as usual with Forest Admin. You will get something like this:

{% embed url="https://1726799947-files.gitbook.io/~/files/v0/b/gitbook-28427.appspot.com/o/assets%2F-M0vHiS-1S9Hw3djvoTw%2F-MVaK60oomPWAs94oqVp%2F-MVaygeb3eEHo1V0Rlcb%2Fimage.png?alt=media&token=5780912a-5916-4d29-9ef1-f5c3ebb61151" %}
