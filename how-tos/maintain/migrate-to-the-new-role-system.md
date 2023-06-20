# Migrate to the new role system

{% hint style="warning" %}
The new Role permissions system requires that you use **version 6.6+** of your agent (version **5.4+** for Rails) on **all** your environments. Moreover, if your project was created before February 2021, please contact Forest Admin support to **ask for it to be "ready to migrate"**.
{% endhint %}

{% hint style="info" %}
You can read more about **Roles** in our [User Guide](https://docs.forestadmin.com/user-guide/project-settings/teams-and-users/manage-roles).
{% endhint %}

The new role system allows you to control all the permissions of your roles from a single details page, which will look like this:‌

![](https://gblobscdn.gitbook.com/assets%2F-LR7SWfEwsNtj\_ZiSkSA%2F-MNNSk\_u0UnHADDKehQM%2F-MNNThkOzU\_zJCmNa0X0%2Fimage.png?alt=media\&token=85dfb86d-5bb4-4b55-b866-6429e7111fad)

To start migrating, since this is still in beta, you will need to **ask someone from the Forest Admin customer success team** to switch your project to a "Ready to migrate" status.‌

Once this is done, go to the _Roles_ tab of your [project settings](https://docs.forestadmin.com/user-guide/project-settings/teams-and-users/manage-roles):‌

![](https://gblobscdn.gitbook.com/assets%2F-LR7SWfEwsNtj\_ZiSkSA%2F-MNNSk\_u0UnHADDKehQM%2F-MNNTPbtZevfRh3GD7Ia%2Fimage.png?alt=media\&token=08276a33-ba62-4ad8-bda5-9c5a81fad437)

Click on _Learn more_. Then, after you've read the instructions, _Start migration process_:‌

![](https://gblobscdn.gitbook.com/assets%2F-LR7SWfEwsNtj\_ZiSkSA%2F-MNNSk\_u0UnHADDKehQM%2F-MNNUH7HsXs-mME-kTHY%2Fimage.png?alt=media\&token=db2b0fc4-7123-4005-86cd-405dfb8e8464)

This is where it gets interesting:‌

All your users will be presented in **groups** **(1)** that have the **exact same permissions** (smart action permissions + collection permissions):‌

![](https://gblobscdn.gitbook.com/assets%2F-LR7SWfEwsNtj\_ZiSkSA%2F-MNNSk\_u0UnHADDKehQM%2F-MNNXNd1bi17vgJLTtCE%2FCapture%20d%E2%80%99e%CC%81cran%202020-11-30%20a%CC%80%2010.39.26.png?alt=media\&token=9b698722-4582-4c81-9bac-19e138be4f00)

If you had created roles and assigned them to smart actions **before** the migration, they will appear there **(2)**. Additionally, if you had assigned them to users, they will be automatically assigned to those users.‌

If you wish to create more roles, you can do so by clicking _Create a new role_ **(3)**.‌

Then assign the available roles to the users of this group **(4)**.

{% hint style="info" %}
At the end of the migration, the permissions presented on the left will be assigned to all the roles displayed on the right (under "Roles").
{% endhint %}

{% hint style="warning" %}
You cannot delete roles at this stage, but you can always rearrange roles after the migration.‌
{% endhint %}

Lastly, review all assigned roles on the last page and validate to finalize the migration process:

![](https://gblobscdn.gitbook.com/assets%2F-LR7SWfEwsNtj\_ZiSkSA%2F-MNNSk\_u0UnHADDKehQM%2F-MNNZTkhuc6vmMGv-dox%2Fimage.png?alt=media\&token=f341149a-665d-445e-8274-e2e0825b5833)
