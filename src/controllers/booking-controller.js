const { BookingService } = require("../services");
const { StatusCodes } = require("http-status-codes");
const { createChannel, publishMessage } = require("../utils/messageQueue");
const { REMINDER_BINDING_KEY } = require("../config/server-config");

const bookingService = new BookingService();

class BookingController {
  constructor() {
    // this.channel = channel;
  }

  async sendMessageToQueue(req, res) {
    const channel = await createChannel();
    const data = {message: "SUCCESS"}
    publishMessage(channel, REMINDER_BINDING_KEY, JSON.stringify(data));
    return res.status(200).json({
      message: "Successfully published the event"
    })
  }

  async create(req, res) {
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
  }
}

module.exports = BookingController;
