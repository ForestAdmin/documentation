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

# Charts

As an admin user, KPIs are paramount to follow day by day. Your customers’ growth, Monthly Recurring Revenue (MRR), Paid VS Free accounts are some common examples.

### What types of charts exist in Forest Admin?

Forest Admin can render six types of charts:

- Single value (Number of customers, MRR, …)

![](<../../.gitbook/assets/image (270).png>)

- Repartition (Number of customers by countries, Paid VS Free, …)

![](<../../.gitbook/assets/image (271).png>)

{% hint style="info" %}
Only the 5 biggest categories will be displayed separately. All the others will go into a 6th "Other" category.
{% endhint %}

- Time-based (Number of sign-ups per month, …)

![](<../../.gitbook/assets/image (272).png>)

- Percentage (% of paying customers, …)

![](<../../.gitbook/assets/image (273).png>)

- Objective (Orders passed per year VS objective, …)

![](<../../.gitbook/assets/image (275).png>)

- Leaderboard (Companies who emitted the most transactions, …)

![](<../../.gitbook/assets/image (274).png>)

Ensure you’ve enabled the `Layout Editor` mode to add, edit or delete a chart.

### Where can you add charts?

Charts can be added in 2 places:

- In your **Dashboard** tab
- In the **Analytics** tab of every record of a collection

In the following pages, you'll learn how to create all types of charts.
