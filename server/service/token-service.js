const jwt = require("jsonwebtoken");
const tokenModel = require("../models/token-model");

class TokenService {
  generateTokens(payload) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '30m' });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' });
    console.log('Generated tokens:', { accessToken, refreshToken });
    return {
      accessToken,
      refreshToken
    };
  }

  validateRefreshToken(token) {
    try {
      const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
      console.log('Validated refresh token:', userData);
      return userData;
    } catch (e) {
      console.error('Token validation error:', e);
      return null;
    }
  }

  async saveToken(userId, refreshToken) {
    try {
      console.log('Saving token...');
      let token = await tokenModel.findOne({ user: userId }).exec();

      if (token) {
        token.refreshToken = refreshToken;
        await token.save();
        console.log('Token updated:', token);
      } else {
        token = await tokenModel.create({ user: userId, refreshToken });
        console.log('Token saved:', token);
      }

      return token;
    } catch (e) {
      console.error('Error saving token:', e);
      return null;
    }
  }

  async findToken(refreshToken) {
    try {
      console.log('Finding token with refreshToken:', refreshToken);
      const token = await tokenModel.findOne({ refreshToken }).exec();
      console.log('Token found:', token);
      return token;
    } catch (e) {
      console.error('Error finding token:', e);
      return null;
    }
  }

  async removeToken(refreshToken) {
    try {
      const result = await tokenModel.deleteOne({ refreshToken });
      console.log('Token removed:', result);
      return result;
    } catch (e) {
      console.error('Error removing token:', e);
      return null;
    }
  }
}

module.exports = new TokenService();
