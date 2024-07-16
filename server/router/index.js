const Router = require("express").Router;
const UserController = require("../controllers/user-controller");
const { body } = require("express-validator");
const tokenService = require('../service/token-service');
const userService = require('../service/user-service');

const router = new Router();

router.post(
  "/registration",
  body("email").isEmail(),
  body("password").isLength({ min: 8, max: 32 }),
  UserController.registration
);
router.post("/login", UserController.login);
router.post("/logout", UserController.logout);
router.get("/activate/:link", UserController.activate);
router.post('/refresh', async (req, res) => { // Змінюємо на POST-запит
  try {
    const { refreshToken } = req.cookies || req.body; // Оновлюємо, щоб працювало з cookies або body

    if (!refreshToken) {
      return res.status(401).json({ message: 'Unauthorized: No refresh token' });
    }

    const userData = tokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await tokenService.findToken(refreshToken);

    if (!userData || !tokenFromDb) {
      return res.status(401).json({ message: 'Unauthorized: Invalid refresh token' });
    }

    const user = await userService.getUserById(userData.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const tokens = tokenService.generateTokens({ id: user.id, email: user.email });
    await tokenService.saveToken(user.id, tokens.refreshToken);

    res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true, sameSite: 'strict' });
    res.json(tokens);
  } catch (e) {
    console.error('Error in /refresh endpoint:', e);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get("/users", UserController.getUsers);

module.exports = router;
