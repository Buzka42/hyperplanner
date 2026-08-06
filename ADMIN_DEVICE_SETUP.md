# Authorize an admin device

`Judziek` is a reserved entry command, not a shared password. Each browser/device has its own Firebase anonymous-auth UID and must receive the `admin: true` custom claim from a trusted machine.

1. On the device to authorize, enter `Judziek`. Copy the **Device UID** shown in the authorization message.
2. In Firebase Console, open **Project settings → Service accounts**, generate a private key, and save the JSON outside the repository.
3. In PowerShell, point Application Default Credentials at that file:

   ```powershell
   $env:GOOGLE_APPLICATION_CREDENTIALS='C:\secure\workout-planner-admin.json'
   npm run admin:device -- grant DEVICE_UID_FROM_SCREEN
   ```

4. Enter `Judziek` again on that device. The app force-refreshes its token and opens the admin panel immediately.

To remove a device:

```powershell
$env:GOOGLE_APPLICATION_CREDENTIALS='C:\secure\workout-planner-admin.json'
npm run admin:device -- revoke DEVICE_UID_FROM_SCREEN
```

Never commit or place the service-account JSON inside this project.
