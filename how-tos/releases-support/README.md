---
description: In order to give more visibility to our developers community, about agent usability and support in the future, you will find, in this page, the important lifecycle dates per agent stack and versions.
---

# Releases Support

## Introduction

Each project using Forest Admin needs a minimal maintenance of the agent dependency installed since day one.
Such maintenance will ensure the best possible experience with the platform: new features, performance improvements, reactive support, and so on.

In order to give more visibility to our developers community, about agent usability and support in the future, you will find, in the section below, the important lifecycle dates per agent stack and versions.

## Definitions

Before jumping into your favorite stack tab, you’ll find below the detailed definition of the agent lifecycle dates:

| Date            | Definition                                                                                                                                                                                                                                                                                                                 |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Initial Release | It marks the date of the official release of a new agent major version, and will, as a consequence, engage Forest Admin on a minimal 18 months period guaranty to keep the agent features 100% compatible with the platform, to provide maintenance, troubleshooting or support, to fix defects, bugs and vulnerabilities. |
| End-of-Support  | At this date, Forest Admin will no longer provide maintenance, troubleshooting or support, and will no longer fix defects, bugs or vulnerabilities.                                                                                                                                                                        |
| End-of-Life     | At this date, Forest Admin will not guarantee the agent will be usable. It is very likely that your agent integration will break your admin panel, as we will start removing some legacy features support on our platform.                                                                                                 |

## Releases information per stack

{% tabs %}
{% tab title="Express Sequelize" %}

A new agent generation has been released to integrate with Node.js projects.
The only way to keep your Forest Admin project running in the future will be to migrate from the [agent v9](https://github.com/ForestAdmin/forest-express-sequelize) to the new [Node.js agent](https://github.com/ForestAdmin/agent-nodejs).
Please follow the dedicated [migration guide](https://docs.forestadmin.com/developer-guide-agents-nodejs/getting-started/migrating).

| Version | Initial Release | Alive | Active Support | End-of-Support | End-of-Life | Lifetime   |
| ------- | --------------- | ----- | -------------- | -------------- | ----------- | ---------- |
| v9      | 2022-10-09      | 🟢    | 🟢             | -              | -           | -          |
| v8      | 2021-07-19      | 🔴    | 🔴             | 2023-12-31     | 2024-06-30  | ~3 years   |
| v7      | 2021-02-22      | 🔴    | 🔴             | 2023-06-30     | 2023-12-31  | ~3 years   |
| v6      | 2020-03-17      | 🔴    | 🔴             | 2022-12-31     | 2023-06-30  | ~3.5 years |
| v5      | 2019-10-31      | 🔴    | 🔴             | 2022-06-30     | 2023-06-30  | ~3.5 years |
| v4      | 2019-10-04      | 🔴    | 🔴             | 2022-06-30     | 2022-12-31  | ~3 years   |
| v3      | 2019-04-22      | 🔴    | 🔴             | 2022-06-30     | 2022-12-31  | ~3.5 years |
| v2      | 2017-11-30      | 🔴    | 🔴             | 2022-06-30     | 2022-12-31  | ~5 years   |
| v1      | 2016-02-06      | 🔴    | 🔴             | 2022-06-30     | 2022-12-31  | ~7 years   |

{% endtab %}

{% tab title="Express Mongoose" %}

A new agent generation has been released to integrate with Node.js projects.
The only way to keep your Forest Admin project running in the future will be to migrate from the [agent v9](https://github.com/ForestAdmin/forest-express-mongoose) to the new [Node.js agent](https://github.com/ForestAdmin/agent-nodejs).
Please follow the dedicated [migration guide](https://docs.forestadmin.com/developer-guide-agents-nodejs/getting-started/migrating).

| Version | Initial Release | Alive | Active Support | End-of-Support | End-of-Life | Lifetime   |
| ------- | --------------- | ----- | -------------- | -------------- | ----------- | ---------- |
| v9      | 2022-10-09      | 🟢    | 🟢             | -              | -           | -          |
| v8      | 2021-07-19      | 🔴    | 🔴             | 2023-12-31     | 2024-06-30  | ~3 years   |
| v7      | 2021-02-22      | 🔴    | 🔴             | 2023-06-30     | 2023-12-31  | ~3 years   |
| v6      | 2020-03-17      | 🔴    | 🔴             | 2022-12-31     | 2023-06-30  | ~3.5 years |
| v5      | 2019-10-31      | 🔴    | 🔴             | 2022-06-30     | 2023-06-30  | ~3.5 years |
| v4      | 2019-10-04      | 🔴    | 🔴             | 2022-06-30     | 2022-12-31  | ~3 years   |
| v3      | 2019-04-22      | 🔴    | 🔴             | 2022-06-30     | 2022-12-31  | ~3.5 years |
| v2      | 2017-11-30      | 🔴    | 🔴             | 2022-06-30     | 2022-12-31  | ~5 years   |
| v1      | 2016-02-06      | 🔴    | 🔴             | 2022-06-30     | 2022-12-31  | ~7 years   |

{% endtab %}

{% tab title="Ruby on Rails" %}

| Version | Initial Release | Alive | Active Support | End-of-Support | End-of-Life | Lifetime   |
| ------- | --------------- | ----- | -------------- | -------------- | ----------- | ---------- |
| v9      | 2024-01-25      | 🟢    | 🟢             | -              | -           | -          |
| v8      | 2023-03-14      | 🟢    | 🟠             | 2025-09-19     | -           | -          |
| v7      | 2021-07-20      | 🔴    | 🔴             | 2023-12-31     | 2024-06-30  | ~3 years   |
| v6      | 2021-02-22      | 🔴    | 🔴             | 2023-06-30     | 2023-12-31  | ~3 years   |
| v5      | 2020-03-20      | 🔴    | 🔴             | 2022-12-31     | 2023-06-30  | ~3.5 years |
| v4      | 2019-10-04      | 🔴    | 🔴             | 2022-06-30     | 2022-12-31  | ~3 years   |
| v3      | 2019-04-22      | 🔴    | 🔴             | 2022-06-30     | 2022-12-31  | ~3.5 years |
| v2      | 2017-11-24      | 🔴    | 🔴             | 2022-06-30     | 2022-12-31  | ~5 years   |
| v1      | 2015-08-11      | 🔴    | 🔴             | 2022-06-30     | 2022-12-31  | ~7.5 years |

{% endtab %}

{% tab title="Django" %}

A new agent generation has been released to integrate with Django projects.
The only way to keep your Forest Admin project running in 2025 will be to migrate from the [legacy agent](https://github.com/ForestAdmin/django-forestadmin) to the new [Python agent](https://github.com/ForestAdmin/agent-python).
Please follow the dedicated [migration guide](https://docs.forestadmin.com/developer-guide-agents-python/getting-started/migrating).

| Version | Initial Release | Alive | Active Support | End-of-Support | End-of-Life | Lifetime   |
| ------- | --------------- | ----- | -------------- | -------------- | ----------- | ---------- |
| v1      | 2021-08-13      | 🟠    | 🔴             | 2024-06-30     | 2024-12-31  | ~3.5 years |

{% endtab %}

{% tab title="Laravel" %}

A new agent generation has been released to integrate with Laravel projects.
The only way to keep your Forest Admin project running in 2025 will be to migrate from the [legacy agent](https://github.com/ForestAdmin/laravel-forestadmin) to the new [PHP agent](https://github.com/ForestAdmin/agent-php).
Please follow the dedicated [migration guide](https://docs.forestadmin.com/developer-guide-agents-php/getting-started/migrating).

| Version | Initial Release | Alive | Active Support | End-of-Support | End-of-Life | Lifetime   |
| ------- | --------------- | ----- | -------------- | -------------- | ----------- | ---------- |
| v1      | 2022-04-15      | 🟠    | 🔴             | 2024-06-30     | 2024-12-31  | ~2.5 years |

{% endtab %}
{% endtabs %}
