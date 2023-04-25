# Manage your Forest Admin environments programmatically

For continuous integration and automatization, we have developed a [CLI](https://github.com/ForestAdmin/toolbelt) which makes it easy to manage your Forest Admin environments.

This can be used for Q\&A and testing purposes.

#### Install

```
$ npm install -g forest-cli
```

#### Commands

```
$ forest [command]
```

**General**

* `user` display the current logged in user.
* `login` sign in to your Forest Admin account.
* `logout` sign out of your Forest Admin account.
* `help [cmd]` display help for \[cmd].

**Projects**

Manage Forest Admin projects.

* `projects` list your projects.
* `projects:get` get the configuration of a project.

**Environments**

Manage Forest Admin environments.

* `environments` list your environments.
* `environments:get` get the configuration of an environment.
* `environments:create` create a new environment.
* `environments:delete` delete an environment.
* `environments:copy-layout` copy the layout from one environment to another.

#### Schema

Manage Forest Admin schema.

`schema:apply` apply the current schema of your repository to the specified environment (using your `.forestadmin-schema.json` file).

{% hint style="info" %}
This option is available only on [lianas version >+ 3](https://app.gitbook.com/@forestadmin/s/documentation/\~/drafts/-LcaGvIb-WdMOABgHOTu/primary/reference-guide/upgrade-to-v3).
{% endhint %}
