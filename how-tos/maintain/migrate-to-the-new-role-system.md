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

# Migrate to the new role system
{% hint style="success" %}
If you still have access to your project today, you are using the new role system already, read more about **Roles** in our [User Guide](https://docs.forestadmin.com/user-guide/project-settings/teams-and-users/manage-roles).
{% endhint %}

{% hint style="danger" %}
The old role system has been deprecated the 1st of June 2023, has reached its end of life the 1st of December 2023, and support has been dropped entirely the 4th of December 2024. Please do note that the new Role permissions system requires that you use **version 6.6+** of your agent (**version 5.4+** for Rails) on **all** your environments. If you are running proper versions and urgently need to migrate to the new Roles system please contact our [support](mailto:support@forestadmin.com).
{% endhint %}

The new role system allows you to control all the permissions of your roles from a single details page, which will look like this:‌

![](https://gblobscdn.gitbook.com/assets%2F-LR7SWfEwsNtj_ZiSkSA%2F-MNNSk_u0UnHADDKehQM%2F-MNNThkOzU_zJCmNa0X0%2Fimage.png?alt=media&token=85dfb86d-5bb4-4b55-b866-6429e7111fad)
