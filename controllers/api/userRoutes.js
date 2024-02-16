const router = require('express').Router();
const { Person } = require('../../models');

// the 'api/users' endpoint

// create a new user
router.post('/', async (req, res) => {
    try {
        const newPerson = await Person.create({
            username: req.body.username,
            password: req.body.password,
        });

        req.session.save(() => {
            req.session.loggedIn = true;
            req.session.personId = newPerson.id;
            console.log("personId in session", req.session.personId);
            res.json(newPerson);
        });

    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});

// login
router.post('/login', async (req, res) => {
    try {
        const personLoggingIn = await Person.findOne({
            where: {
                username: req.body.username,
            },
        });
        if (!personLoggingIn){
            return res.status(400).json({message: 'Incorrect username or password. Please try again.'});
        }

        const isPasswordValid = await personLoggingIn.checkPassword(req.body.password);

        if(!isPasswordValid){
            return res.status(400).json({message: 'Incorrect username or password. Please try again.'});
        }

        req.session.save(() => {
            req.session.loggedIn = true;

            res.json({ user: personLoggingIn, message: 'You are now logged in.' });
        });
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});

// logout
router.post('/logout', async (req, res) => {
    if (req.session.loggedIn) {
        req.session.destroy(() => res.status(204).end());
    } else {
        res.status(404).end();
    }
});

module.exports = router;