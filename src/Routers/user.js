import express from "express";
import User from "../models/user.js";
import auth from "../middleware/auth.js";
import { request } from "express";
const userRouter = new express.Router();

const success = true;

//creates new user
userRouter.post("/users/signup", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

// loggin
userRouter.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (e) {
    res.status(401).send();
  }
});

//user logout
userRouter.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });

    await req.user.save();

    res.status(200).send();
  } catch (e) {
    res.status(500).send();
  }
});


userRouter.post('/users/saveData', auth, async (req, res) => {
  try {
    req.user.markdown = req.body.markdown
    await req.user.save();
    res.status(200).send({status : "pass"});
  } catch (e) {
    res.status(500).send({status:  "failed"});
  }
})

userRouter.get('/users/saveData', auth, async (req, res) => {
  try {
    let markdown = req.user.markdown
    res.status(200).send({markdown: markdown});
  } catch (e) {
    res.status(500).send();
  }
})

userRouter.get('/users/me', auth, async (req, res) => {
    res.status(202).send(req.user)
})

export default userRouter;