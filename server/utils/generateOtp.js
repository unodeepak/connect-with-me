/* Generate 6 Digit OTP */
module.exports = () => {
  return Math.floor(Math.random() * 900000).toString();
};
