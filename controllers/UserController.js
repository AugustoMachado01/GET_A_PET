const User = require("../models/Users");
const bcrypt = require("bcrypt");

const createUserToken = require("../helpers/create-user-token");

module.exports = class UserController {
  static async register(req, res) {
    const { name, email, phone, password, confirmpassword } = req.body;

    //validations
    if (!name) {
      res.status(422).json({ message: "O nome é obrigatório" });
      return;
    }

    if (!email) {
      res.status(422).json({ message: "O email é obrigatório" });
      return;
    }

    if (!phone) {
      res.status(422).json({ message: "O telefone é obrigatório" });
      return;
    }

    if (!password) {
      res.status(422).json({ message: "A senha é obrigatória" });
      return;
    }

    if (!confirmpassword) {
      res.status(422).json({ message: "A confirmação de senha é obrigatória" });
      return;
    }

    if (password !== confirmpassword) {
      res.status(422).json({ message: "Senhas diferentes" });
      return;
    }

    // check if user exists
    const userExists = await User.findOne({ email: email });

    if (userExists) {
      res.status(422).json({ message: "Por favor utilize outro email" });
      return;
    }

    //create password
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    // create a user
    const user = new User({
      name,
      email,
      phone,
      password: passwordHash,
    });

    try {
      const newUser = await user.save();

      await createUserToken(newUser, req, res);
    } catch (error) {
      res.status(400).json({ message: error });
      console.log(error);
    }
  }

  static async login(req, res) {
    const { email, password } = req.body;

    if (!email) {
      res.status(422).json({ message: "O email é obrigatório" });
      return;
    }

    if (!password) {
      res.status(422).json({ message: "A senha é obrigatória" });
      return;
    }

    // check if user exists
    const user = await User.findOne({ email: email });

    if (!user) {
      res
        .status(422)
        .json({ message: "Não tem   usuário cadastrado com esse email" });
      return;
    }

    // check if password match width db password
    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
      res.status(422).json({ message: "Senha invalida" });
      return;
    }

    await createUserToken(user, req, res);
  }
};
