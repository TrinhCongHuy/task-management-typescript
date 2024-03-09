import { Request, Response } from "express";

import User from "../models/user.model";
import ForgotPassword from "../models/forgot-password.model";
import md5 from "md5";
import {
  generateRandomNumber,
  generateRandomString,
} from "../../../helpers/generate";
import sendMail from "../../../helpers/sendMail";

// [POST] /api/v1/users/register
export const register = async (req: Request, res: Response) => {
  const email = req.body.email;
  req.body.password = md5(req.body.password);

  const exitEmail = await User.findOne({
    email: email,
    deleted: false,
  });

  if (exitEmail) {
    res.json({
      code: 400,
      message: "Tài khoản này đã tồn tại!",
    });
  } else {
    const user = new User({
      fullName: req.body.fullName,
      email: req.body.email,
      password: req.body.password,
      token: generateRandomString(20),
    });

    await user.save();

    const token = user.token;

    res.cookie("token", token);

    res.json({
      code: 200,
      message: "Đăng ký tài khoản thành công!",
      token: token,
    });
  }
};

// [POST] /api/v1/users/login
export const login = async (req: Request, res: Response) => {
  const email: string = req.body.email;
  const password = md5(req.body.password);

  const user = await User.findOne({
    email: email,
    deleted: false,
  });

  if (!user) {
    res.json({
      code: 400,
      message: "Email này không tồn tại!",
    });
    return;
  }

  if (password != user.password) {
    res.json({
      code: 400,
      message: "Mật khẩu sai!",
    });
    return;
  }

  const token = user.token;

  res.cookie("token", token);

  res.json({
    code: 200,
    message: "Đăng nhập thành công!",
    user: user,
  });
};

// [POST] /api/v1/users/password/forgot
export const forgotPassword = async (req: Request, res: Response) => {
  const email = req.body.email;

  const exitEmail = await User.findOne({
    email: email,
    deleted: false,
  });

  if (!exitEmail) {
    res.json({
      code: 400,
      message: "Email này không tồn tại!",
    });
    return;
  }

  const otp = generateRandomNumber(6);

  const objectForgotPassword = {
    email: email,
    otp: otp,
    expireAt: Date.now(),
  };

  const forgotPassword = new ForgotPassword(objectForgotPassword);
  await forgotPassword.save();

  const subject = "Mã OPT xác minh lấy lại mật khẩu";
  const html = `Mã OTP để lấy lại mật khẩu của bạn là ${otp}. Mã có thời hạn 3 phút. Lưu ý không chia sẻ mã OTP cho bất kỳ ai!`;

  sendMail(email, subject, html);

  res.json({
    code: 200,
    message: "Đã gửi mã OTP qua email!",
    otp: otp,
  });
};

// [POST] /api/v1/users/password/opt
export const otpPassword = async (req: Request, res: Response) => {
  const email = req.body.email;
  const otp = req.body.otp;

  const result = await ForgotPassword.findOne({
    email: email,
    otp: otp,
  });

  if (!result) {
    res.json({
      code: 400,
      message: "Mã OTP không hợp lệ!",
    });
    return;
  }

  const user = await User.findOne({
    email: email,
  });

  const token = user.token;

  res.cookie("token", token);

  res.json({
    code: 200,
    message: "Nhập mã OTP thành công!",
    token: token,
  });
};

// [POST] /api/v1/users/password/reset
export const resetPassword = async (req: Request, res: Response) => {
  const password = md5(req.body.password);
  const confirmPassword = md5(req.body.confirmPassword);
  const token = req.body.token;

  if (password != confirmPassword) {
    res.json({
      code: 400,
      message: "Mật khẩu nhập lại không chính xác!",
    });
    return;
  }

  await User.updateOne(
    {
      token: token,
    },
    {
      password: password,
    }
  );

  res.json({
    code: 200,
    message: "Thay đổi mật khẩu thành công!",
  });
};

// [POST] /api/v1/users/detail/:id
export const detail = async (req: Request, res: Response) => {
  res.json({
    code: 200,
    message: "Thành công!",
    info: req["user"],
  });
};
