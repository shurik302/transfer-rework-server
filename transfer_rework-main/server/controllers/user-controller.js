const ApiError = require("../exceptions/api-error");
const userModel = require("../models/user-model");
const userService = require("../service/user-service");
const {validationResult} = require("express-validator");

class UserController {
    async registration(req, res, next){
        try{
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return next(ApiError.BadRequest("Помилка при валідації", errors.array()));
            }
            const {email, password} = req.body;
            const UserData = await userService.registration(email, password);
            res.cookie("refreshToken", UserData.refreshToken, {maxAge: 30*24*60*60*1000, httpOnly: true})
            return res.json(UserData);
        } catch(e){
            next(e);
        }    
    }
    async login(req, res, next){
        try{
            const {email, password} = req.body;
            const UserData = await userService.login(email, password);
            res.cookie("refreshToken", UserData.refreshToken, {maxAge: 30*24*60*60*1000, httpOnly: true})
            return res.json(UserData);
        } catch(e){
            next(e);
        }    
    }
    async logout(req, res, next){
        try{
            const {refreshToken} = req.cookies;
            const token = await userService.logout(refreshToken);
            res.clearCookie("refreshToken");
            return res.json(token);
        } catch(e){
            next(e);
        }    
    }
    async activate(req, res, next) {
        try {
            const activationLink = req.params.link;
            console.log(`Отримане посилання: ${activationLink}`);
            await userService.activate(activationLink);
            return res.redirect(process.env.CLIENT_URL);
        } catch (e) {
            console.log('Помилка активації:', e);
            next(e);
        }
    }
    
    async refresh(req, res, next){
        try{
            const {refreshToken} = req.cookies;
            const UserData = await userService.refresh(refreshToken);
            res.cookie('refreshToken', UserData.refreshToken, { httpOnly: true, secure: true });
            return res.json(UserData);
        } catch(e){
            next(e);
        }    
    }

    async getUsers(req, res, next) {
          try {
            const users = await userModel.find();
            res.json(users);
          } catch (e) {
            next(e);
          }
        }
}

module.exports = new UserController();