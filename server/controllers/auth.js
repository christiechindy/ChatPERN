const knex = require("../db/knex");
const db = require("../db/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
    const findUser = await knex.select().from("users").where({email: req.body.email});

    if (findUser.length) {
        return res.status(409).json("User already exists!");
    } else {
        //hash the password and create a user
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);

        await knex("users").insert({
            name: req.body.name, 
            email: req.body.email, 
            password: hash
        });
        
        return res.status(200).json("User has been created.");
    }  
}

const login = async (req, res) => {
    console.log("login is called from the controller");
    const findUser = await knex.select().from("users").where({email: req.body.email});

    if (findUser.length === 0) {
        return res.status(404).json("User not found!");
    } else {
        const isPasswordCorrect = bcrypt.compareSync(req.body.password, findUser[0].password);

        if (!isPasswordCorrect) {
            return res.status(400).json("Wrong username or password")
        } else {
            const token = jwt.sign({id: findUser[0].user_id}, "IHS");
            const {password, ...other} = findUser[0]
            res.cookie("access_token", token).status(200).json(other);
        }
    }
}

const logout = (req, res) => {
    res.clearCookie("access_token", {
        sameSite: "none",
        secure: true
    }).status(200).json("User has been logged out");
}

module.exports = { register, login, logout };