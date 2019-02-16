A-Frame VR experiences with a database backend
------------

On the front-end,
- edit `views/index.html` and add anything extra in `public/`
- drag in `assets`, like images or music, to add them to your project

On the back-end,
- your app starts at `server.js`
- add frameworks and packages in `package.json`
- safely store app secrets in `.env` (nobody can see this but you and people you invite)

This app has a database!
- this app uses sqlite
- you can verify the content of the database in [flat.html](https://experiences.glitch.me/flat.html)
- `sqlite.db` is created and put into the `.data` folder, a hidden directory whose contents aren’t copied when a project is remixed. you can see the contents of `.data` in the console under "Logs"


Made from the [Glitch](https://glitch.com/) hello-sqlite example.