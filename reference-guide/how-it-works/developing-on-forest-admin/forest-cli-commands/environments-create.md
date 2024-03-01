{% hint style="warning" %}
VERSION WARNING TEST
{% endhint %}

# environments:create

## Creating a test environment

You might consider having test environments created from your CI/CD to help you on testing your integrations.

Remote environments can be used for testing as-well, but in this kind of environment you will have to handle roles and permissions to give access to a newly created smart action or a new collection. This can lead to frustration as it can break your continuous delivery process because as a developer, you might not have access to the roles settings of your project. This would require you, for every of the environment created, to ask for an admin to set the roles and permissions up.

Test environment have been designed to tackle this topic. They basically are remote environments, but without the roles and permissions system.

These environments can be accessed by developers, admins and editors from the environments' dropdown. Users can have access as-well, but the environment will not be proposed in their dropdown for convenience. You will need to send the entire Forest url to them.

This kind of environment should be created by using the forest CLI. An option is at your disposal, indicating that you want to disable the roles: `--disabledRoles`.

Here is an example:

`forest environments:create --name 'pr-1930' -u 'https://pr-1930.company.com' --disableRoles`

And that is it! Make sure your test server as correctly started and reach your admin panel to observe that a new environment appeared with everything accessible by default.
