//---------------------------Async -Error handling- function------
const catchAsync = function (fn) {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};
module.exports = catchAsync;

//In catch next automatically send this into global error handler
