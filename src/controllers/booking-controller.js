const { BookingService } = require("../services");
const { StatusCodes } = require("http-status-codes");

const bookingService = new BookingService();

const create = async (req, res) => {
  try {
    const response = await bookingService.createBooking(req.body);
    return res.status(StatusCodes.OK).json({
      data: response,
      message: "Successfully created a booking",
      success: true,
      error: {},
    });
  } catch (error) {
    return res.status(error.statusCode).json({
      data: {},
      error: error.explaination,
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  create,
};
