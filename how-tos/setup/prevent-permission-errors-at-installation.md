---
description: >-
  If you see an EACCES error when you try to install a lumber-cli globally,
  follow this tutorial.
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

# Prevent permission errors at installation

Depending on how you've installed Node.js on your system, you could encounter a permissions error **EACCES** similar to the following output.

{% hint style="info" %}
&#x20;In this case, I got the error on a EC2 instance running on Ubuntu 10.04 with Node v8.10.0 and NPM v.3.5.2. But you can have this similar problem on another system and node version.
{% endhint %}

```bash
npm ERR! Linux 4.15.0-1021-aws
npm ERR! argv "/usr/bin/node" "/usr/bin/npm" "install" "-g" "lumber-cli" "--save"
npm ERR! node v8.10.0
npm ERR! npm  v3.5.2
npm ERR! path /usr/local/lib
npm ERR! code EACCES
npm ERR! errno -13
npm ERR! syscall access

npm ERR! Error: EACCES: permission denied, access '/usr/local/lib'
npm ERR!  { Error: EACCES: permission denied, access '/usr/local/lib'
npm ERR!   errno: -13,
npm ERR!   code: 'EACCES',
npm ERR!   syscall: 'access',
npm ERR!   path: '/usr/local/lib' }
npm ERR!
npm ERR! Please try running this command again as root/Administrator.

npm ERR! Please include the following file with any support request:
npm ERR!     /home/ubuntu/npm-debug.log
```

The problem is because NPM does not have the **write access** to the directory that will contain the package you want to install (here `lumber-cli`).

To solve this issue, we recommend to override the default directory where your global NPM packages will be stored.

```bash
mkdir ~/.npm-global
```

Then, configure NPM to use this directory instead of the default one:

```bash
npm config set prefix '~/.npm-global'
```

Then, make the node executables accessible from your _PATH._ To do so, export the environment variable PATH by opening or creating the file `~/.profile` and add this line at the end:

{% code title="~/.profile" %}

```bash
export PATH=~/.npm-global/bin:$PATH
```

{% endcode %}

Finally, reload the `~/.profile` file:

```bash
source ~/.profile
```

That's it, now you should be able to install lumber without any error 🎉

```bash
npm install -g lumber-cli
```
