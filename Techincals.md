# Node

---

- **package-lock.json:** This gives the exact version of what package is using, to specify the exact versions of dependencies for a project.

## Express

- Order of Route matters.

- One route can have multiple route handler.

- If you doesnot send request from one handler to another it will basically halts. For that it needs `next`

- ONly one response will be sent from one handler, ot will throw an error.

- Requests go through a chain of **middlewares**

### Middlwares

- Will be used for auth purposes

### Express.ROuter()

- For better route management.
