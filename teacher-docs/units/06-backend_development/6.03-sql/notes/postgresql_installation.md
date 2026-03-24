# PostgreSQL Installation

## Install PostgreSQL

1. [Click this link](https://www.enterprisedb.com/downloads/postgres-postgresql-downloads)
   to download the version **18** installer for your operating system.
2. Run the downloaded installer. You do not need to change any of the installer's
   provided default options.
3. Write down the installation directory. You will need this later. The defaults are:
   - Windows: `C:\Program Files\PostgreSQL\18\`
   - Mac: `/Library/PostgreSQL/18/`
4. You can keep the port at the default `5432`.
5. When prompted to provide a password for the database superuser (postgres),
   **write the password down**! It is important that you remember this password.
6. You _do not_ need to launch Stack Builder at exit.

## Add `psql` to path

### Windows

In your terminal (PowerShell, _not_ cmd), run the following commands.
Make sure `$PSQL_PATH` matches the installation directory that you wrote down earlier!
Append `bin` to the end of that path.

```pwsh
$PSQL_PATH="C:\Program Files\PostgreSQL\18\bin;"
[Environment]::SetEnvironmentVariable("Path",$PSQL_PATH + $env:PATH, "User")
```

### Mac

In your terminal, run the following commands.
Make sure `PSQL_PATH` matches the installation directory that you wrote down earlier!
Append `bin` to the end of that path.

```bash
cd ~
PSQL_PATH=/Library/PostgreSQL/18/bin
echo "export PATH=$PSQL_PATH:\$PATH" >> .zshrc
```

## Create initial role and database

1. Open a new terminal and run `psql`. It will prompt you for the password for a user.
   **Remember this name!** It is case-sensitive, so `name` is different from `Name`.
2. Press `enter` to **fail** the password prompt, since the user is not initialized yet.
3. Run `psql -U postgres` and type the database superuser password that you provided
   earlier during the installation. If successful, you should see a prompt like this: `postgres=#`.

> [!WARNING]
>
> For the following steps, you need to include the double quotes around the name
> and the single quotes around the password.
> Don't forget the semicolon at the end of the command!

4. Run the following command with the _exact_ name from step 1.
   **Change the password** to something you will remember.\
   `CREATE ROLE "Name" WITH SUPERUSER LOGIN PASSWORD 'password';`
   - Example:\
     `CREATE ROLE "Foo.bar" WITH SUPERUSER LOGIN PASSWORD 'wobble';`
   - If successful, you should see the message `CREATE ROLE`.
5. Run the following command with the _exact_ name from step 1.\
   `CREATE DATABASE "Name" OWNER "Name";`
   - Example:\
     `CREATE DATABASE "Foo.bar" OWNER "Foo.bar";`
   - If successful, you should see the message `CREATE DATABASE`.
6. Run `\q` to quit out.
7. Test your connection by running `psql` again.
   - When prompted for a password, enter the password that you set in step 4.
   - If successful, you should see a prompt like this: `Foo.bar=#`.
8. Run `\q` to quit out.

If you can successfully log into `psql`, you're all set!
