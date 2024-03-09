"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.detail = exports.resetPassword = exports.otpPassword = exports.forgotPassword = exports.login = exports.register = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const forgot_password_model_1 = __importDefault(require("../models/forgot-password.model"));
const md5_1 = __importDefault(require("md5"));
const generate_1 = require("../../../helpers/generate");
const sendMail_1 = __importDefault(require("../../../helpers/sendMail"));
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    req.body.password = (0, md5_1.default)(req.body.password);
    const exitEmail = yield user_model_1.default.findOne({
        email: email,
        deleted: false,
    });
    if (exitEmail) {
        res.json({
            code: 400,
            message: "Tài khoản này đã tồn tại!",
        });
    }
    else {
        const user = new user_model_1.default({
            fullName: req.body.fullName,
            email: req.body.email,
            password: req.body.password,
            token: (0, generate_1.generateRandomString)(20),
        });
        yield user.save();
        const token = user.token;
        res.cookie("token", token);
        res.json({
            code: 200,
            message: "Đăng ký tài khoản thành công!",
            token: token,
        });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const password = (0, md5_1.default)(req.body.password);
    const user = yield user_model_1.default.findOne({
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
});
exports.login = login;
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const exitEmail = yield user_model_1.default.findOne({
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
    const otp = (0, generate_1.generateRandomNumber)(6);
    const objectForgotPassword = {
        email: email,
        otp: otp,
        expireAt: Date.now(),
    };
    const forgotPassword = new forgot_password_model_1.default(objectForgotPassword);
    yield forgotPassword.save();
    const subject = "Mã OPT xác minh lấy lại mật khẩu";
    const html = `Mã OTP để lấy lại mật khẩu của bạn là ${otp}. Mã có thời hạn 3 phút. Lưu ý không chia sẻ mã OTP cho bất kỳ ai!`;
    (0, sendMail_1.default)(email, subject, html);
    res.json({
        code: 200,
        message: "Đã gửi mã OTP qua email!",
        otp: otp,
    });
});
exports.forgotPassword = forgotPassword;
const otpPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const otp = req.body.otp;
    const result = yield forgot_password_model_1.default.findOne({
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
    const user = yield user_model_1.default.findOne({
        email: email,
    });
    const token = user.token;
    res.cookie("token", token);
    res.json({
        code: 200,
        message: "Nhập mã OTP thành công!",
        token: token,
    });
});
exports.otpPassword = otpPassword;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const password = (0, md5_1.default)(req.body.password);
    const confirmPassword = (0, md5_1.default)(req.body.confirmPassword);
    const token = req.body.token;
    if (password != confirmPassword) {
        res.json({
            code: 400,
            message: "Mật khẩu nhập lại không chính xác!",
        });
        return;
    }
    yield user_model_1.default.updateOne({
        token: token,
    }, {
        password: password,
    });
    res.json({
        code: 200,
        message: "Thay đổi mật khẩu thành công!",
    });
});
exports.resetPassword = resetPassword;
const detail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json({
        code: 200,
        message: "Thành công!",
        info: req["user"],
    });
});
exports.detail = detail;
