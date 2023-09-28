const userModel = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { token } = require("morgan");
exports.getUsers = (req, res, next) => {
  userModel
    .findAll()
    .then((listUser) => {
      res.status(200).json({ message: "get all users", listUser: listUser });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
exports.getUsersByID = (req, res, next) => {
  const userId = req.params.userId;
  userModel.findByPk(userId).then((user) => {
    //
    if (!user) {
      res.status(201).json({ status: false, message: "ko tim thay" });
    } else {
      res
        .status(201)
        .json({ status: true, message: "da tim thay", user: user });
    }
  });
};
exports.createUser = (req, res, next) => {
  const _email = req.body.email;
  const _fullname = req.body.fullname;
  const _phone = req.body.phone;
  const _gender = req.body.gender;
  const _password = req.body.password;

  // _user.save().then((result) => {
  //   res
  //     .status(201)
  //     .json({ status: true, message: "them thanh cong", user: _user });
  // });
  userModel
    .findOne({
      where: { email: _email },
    })
    .then((user) => {
      if (user) {
        return res.status(400).json({
          status: false,
          message: "email này đã tồn tại",
        });
      }
      return bcrypt.hash(_password, 12);
    })
    .then((hashedPassword) => {
      const _user = new userModel({
        email: _email,
        fullname: _fullname,
        phone: _phone,
        gender: _gender,
        password: hashedPassword,
      });
      return _user.save();
    })
    .then((user) => {
      res.status(201).json({
        status: true,
        message: "them user thanh cong",
        user: user,
      });
    })
    .catch((err) => res.status(404).json(err));
};
exports.updateUser = (req, res, next) => {
  const _email = req.body.email;
  const _fullname = req.body.fullname;
  const _phone = req.body.phone;
  const _gender = req.body.gender;
  const _password = req.body.password;
  const _user = new Object({
    email: _email,
    fullname: _fullname,
    phone: _phone,
    gender: _gender,
    password: _password,
  });
  // userModel.update(_user, {
  //     where: { email: _user.email },
  // });
  userModel.findByPk(_email).then((user) => {
    //
    if (!user) {
      res.status(201).json({ status: false, message: "ko tim thay" });
    } else {
      userModel
        .update(_user, {
          where: {
            email: _user.email,
          },
        })
        .then((result) => {
          res
            .status(201)
            .json({ status: true, message: "update thanh cong", user: _user });
        });
    }
  });
};
exports.delUserById = (req, res, next) => {
  const userId = req.params.userId;
  userModel
    .findByPk(userId)
    .then((user) => {
      //
      if (!user) {
        res.status(201).json({ status: false, message: "ko tim thay" });
      } else {
        // res.status(201).json({status: true, message: "da tim thay", user: user});
        userModel.destroy({ where: { email: userId } }).then((result) => {
          res.status(201).json({
            status: true,
            message: "delete thanh cong",
          });
        });
      }
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
// exports.checkLogin = (req, res, next) => {
//   const _email = req.body.email;
//   const _password = req.body.password;
//   userModel.findByPk(_email).then((user) => {
//     //
//     if (!user) {
//       res
//         .status(201)
//         .json({ status: false, message: "Username và pass ko tồn tại" });
//     } else {
//       //   res
//       //     .status(201)
//       //     .json({ status: true, message: "da tim thay", user: user });
//       if (user.password == _password) {
//         res.status(201).json({
//           status: true,
//           message: "dang nhap thanh cong",
//           user: user,
//         });
//       } else {
//         res.status(201).json({
//           status: false,
//           message: "password ko ton tai",
//         });
//       }
//     }
//   });
// };
// đổi pass
exports.updateUser = (req, res, next) => {
  const _email = req.body.email;
  const _fullname = req.body.fullname;
  const _phone = req.body.phone;
  const _gender = req.body.gender;
  const _password = req.body.password;

  // _user.save().then((result) => {
  //   res
  //     .status(201)
  //     .json({ status: true, message: "them thanh cong", user: _user });
  // });
  userModel
    .findOne({
      where: { email: _email },
    })
    .then((user) => {
      if (!user) {
        return res.status(400).json({
          status: false,
          message: "email này đã tồn tại",
        });
      }
      return bcrypt.hash(_password, 12);
    })
    .then((hashedPassword) => {
      const _user = new Object({
        email: _email,
        fullname: _fullname,
        phone: _phone,
        gender: _gender,
        password: hashedPassword,
      });
      return userModel.update(_user, { where: { email: _user.email } });
    })
    .then((num) => {
      if (num == 1) {
        return res.status(201).json({
          status: true,
          message: "cap nhat thanh cong",
          user: num,
        });
      } else {
        return res.status(201).json({
          status: false,
          message: "cap nhat ko thanh cong",
          user: num,
        });
      }
    })
    .catch((err) => res.status(404).json(err));
};
exports.checkLogin = (req, res, next) => {
  const _email = req.body.email;
  const _password = req.body.password;
  userModel
    .findOne({ where: { email: _email } })
    .then((user) => {
      if (!user) {
        return res.status(200).json({
          status: false,
          message: "enail ko ton tai",
        });
      }
      return Promise.all([bcrypt.compare(_password, user.password), user]);
    })
    .then((result) => {
      const isMatch = result[0];
      const user = result[1];
      if (!isMatch) {
        return res.status(200).json({
          status: false,
          message: "pass chưa đúng",
        });
      }
      const payLoad = { email: user.email };
      return jwt.sign(payLoad, "F1", { expiresIn: 3600 });
    })
    .then((token) => {
      res.status(200).json({
        status: true,
        message: "Thành công",
        token: 1,
      });
    })
    .catch((err) => {
      return res.status(500).json(err);
    });
};
