/* Generate 6 Digit OTP */
module.exports = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};
