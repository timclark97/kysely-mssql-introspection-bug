# MSSQL Table Introspection Returning Duplicate Columns

### To Reproduce
1. Set up MSSQL server on localhost with user `sa` and password `password_01` and database `test`
2. Run the following to create the test table
```sql
CREATE TABLE [dbo].[test_table] (
    [column_1] NVARCHAR (MAX) NULL
);
```
3. run `npm i`
4. Run `npm run test` and see 2 columns get logged.

### The Cause
This is a [known issue](https://stackoverflow.com/questions/20348522/in-sql-server-what-is-the-difference-between-user-type-id-and-system-type-id-in) caused by how MSSQL manages types internally. It surfaces in the [`.getTables` method](https://github.com/kysely-org/kysely/blob/master/src/dialect/mssql/mssql-introspector.ts#L41) where the query joins `sys.types` to `sys.columns` on `system_type_id` when it should be using `user_type_id`

```sql
-- Returns 2 rows
SELECT c.name, ty.name, ty.system_type_id, ty.user_type_id
FROM sys.tables AS t 
INNER JOIN sys.columns AS c ON t.object_id = c.object_id
INNER JOIN sys.types AS ty ON ty.system_type_id = c.system_type_id
WHERE t.name = 'test_table'
```
VS
```sql
-- Returns 1 row
SELECT c.name, ty.name, ty.system_type_id, ty.user_type_id
FROM sys.tables AS t 
INNER JOIN sys.columns AS c ON t.object_id = c.object_id
INNER JOIN sys.types AS ty ON ty.user_type_id = c.user_type_id
WHERE t.name = 'test_table'
```