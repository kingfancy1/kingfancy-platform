class CaptchaService {
  constructor() {
    this.enabled = true;
    this.pendingCaptchas = new Map();
  }

  generateMathCaptcha(userId) {
    const num1 = Math.floor(Math.random() * 20) + 1;
    const num2 = Math.floor(Math.random() * 20) + 1;
    const answer = num1 + num2;
    
    const captchaId = Math.random().toString(36).substring(7);
    this.pendingCaptchas.set(captchaId, { userId, answer, expiresAt: Date.now() + 300000 });
    
    setTimeout(() => this.pendingCaptchas.delete(captchaId), 300000);
    
    return {
      captchaId,
      question: `What is **${num1} + ${num2}**?`,
      expiresIn: 300
    };
  }

  verifyCaptcha(captchaId, answer) {
    const captcha = this.pendingCaptchas.get(captchaId);
    
    if (!captcha) {
      return { success: false, error: 'CAPTCHA not found or expired' };
    }
    
    if (Date.now() > captcha.expiresAt) {
      this.pendingCaptchas.delete(captchaId);
      return { success: false, error: 'CAPTCHA expired' };
    }
    
    if (answer.toString() === captcha.answer.toString()) {
      this.pendingCaptchas.delete(captchaId);
      return { success: true, message: 'CAPTCHA verified!' };
    }
    
    return { success: false, error: 'Incorrect answer' };
  }
}

module.exports = new CaptchaService();