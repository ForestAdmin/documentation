---
description: >-
  If you see an EACCES error when you try to install a lumber-cli globally,
  follow this tutorial.
---

{% hint style="warning" %}
VERSION WARNING TEST
{% endhint %}

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
