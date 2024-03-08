---
description: >-
  This page explains how to update your schema and avoid issues when pushing
  layout changes.
---

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

# schema:diff \[beta]

## What is this about?

It was brought to our attention that conflicts with schemas might occur when trying to push layout changes. To make the process easier for our customers and the support team, we have implemented a new feature that allows users to compare two schemas on two different environments with a simple command.

## The command

`forest schema:diff [ID env1] [ID env2]` will help you figure out whether there's a difference that, if not addressed, will make you run into issues down the line.&#x20;

In order to run it, there are a few steps to follow, as shown below.&#x20;

## Instructions

### Step 1: obtain environments' IDs

To compare two schemas, you will obviously need the IDs of the two environments you want to compare. To retrieve these IDs, run the following command:

```bash
forest environments
```

You must select your project like shown below.

<figure><img src="../../../../.gitbook/assets/select-your-project.png" alt=""><figcaption></figcaption></figure>

We have chosen `project-2`

<figure><img src="../../../../.gitbook/assets/envs.png" alt=""><figcaption></figcaption></figure>

### Step 2: compare schemas

Once you have retrieved the environment IDs, `schema:diff` takes both as parameters – so you can use the following command to compare the schemas:

```
forest schema:diff [environment ID 1] [environment ID 2]
```

For example, if you want to compare environments with IDs 367 and 368, you would run the following command:

```
forest schema:diff 367 368
```

### Step 3: interpret results

If the schemas are different, you will see a list of the differences between the two schemas. If the schemas are identical, you will see a message indicating that the schemas are the same.

If there is a difference:

<figure><img src="../../../../.gitbook/assets/diff.png" alt=""><figcaption></figcaption></figure>

Or, if there is no difference:

<figure><img src="../../../../.gitbook/assets/no-diff.png" alt=""><figcaption></figcaption></figure>

### Bonus: Help command

If you need help using the schema:diff command, you can access the help information by running the following command:

```
forest schema:diff --help
```

## Future iterations

This being a Beta version, we will continue to improve this solution as time goes on – and also as we receive relevant feedback that can better guide us to meet our customers' needs.

### Wizard/Prompt

In the next iteration, we plan to add a wizard or prompt to the `schema:diff` command. This will make it easier for customers to select the right environment without having to retrieve the environment list first.
