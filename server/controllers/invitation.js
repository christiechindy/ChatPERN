const knex = require("../db/knex");
const db = require("../db/db");

const addFriend = async (req, res) => {
    try {
        const id = await knex.select("user_id").from("users").where({email: req.body.email});
    
        if (!id[0]?.user_id) {
            return res.json("Sorry, that email hasn't been registered in our app")
        }
    
        //tmbhkan utk cek sdh berteman atau tidak
        await knex("friends_relation").insert({
            person1: req.body.person1, 
            person2: id[0].user_id
        });
        return res.json("Please wait for your friend confirmation");
    } catch (err) {
        console.log(err);
    }
}

const invdata = async (req, res) => {
    const account = await knex.select("pict", "name", "user_id").from("users").where({user_id: req.body.id});

    return res.json(account);
}

const lists = async (req, res) => {
    // const invs = await knex.select().from("friends_relation").where({status: false, person2: req.body.id});

    // select public.users."name", public.users.pict, public.friends_relation.relation_id, public.friends_relation.person1, public.friends_relation.person2, public.friends_relation.request_time, public.friends_relation.status
    // from public.users 
    // join public.friends_relation on public.users.user_id = public.friends_relation.person1;

    try {
        const invs = await knex("users")
                            .join("friends_relation", "users.user_id", "=", "friends_relation.person1")
                            .select(
                                "users.name",
                                "users.pict",
                                "friends_relation.relation_id",
                                "friends_relation.person1",
                                "friends_relation.person2",
                                "friends_relation.request_time",
                                "friends_relation.status")
                            .where("friends_relation.status", "false")
                            .andWhere("friends_relation.person2", req.body.id);
    
        return res.json(invs);
    } catch (err) {
        console.log(err);
    }
}

const accinv = async (req, res) => {
    await knex("friends_relation").where({relation_id: req.body.relation_id}).update({status: true})

    return res.status(200).json("Accepted!");
}

const refuseinv = async(req, res) => {
    await knex("friends_relation").where({relation_id: req.body.relation_id}).del()

    return res.json("Success!")
}

module.exports = {addFriend, invdata, lists, accinv, refuseinv};