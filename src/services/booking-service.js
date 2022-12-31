const { default: axios } = require("axios");
const { FLIGHT_SERVICE_PATH } = require("../config/server-config");
const { BookingRepository } = require("../repository");
const { ServiceError } = require("../utils/errors");

class BookingService {
  constructor() {
    this.bookingRepository = new BookingRepository();
  }

  async createBooking(data) {
    try {
      const { flightId, noOfSeats } = data;
      const getFlightRequestURL = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${flightId}`;
      const response = await axios.get(getFlightRequestURL);
      const flightData = response.data.data;
      const { price, totalSeats } = flightData;
      if (noOfSeats > totalSeats) {
        throw new ServiceError(
          "Something went wrong in the booking process",
          "Insufficient seats in the flight"
        );
      }
      const totalCost = price * noOfSeats;
      const bookingPayload = { ...data, totalCost };
      const booking = await this.bookingRepository.create(bookingPayload);
      const updateFlightRequestURL = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${booking.flightId}`;
      console.log(updateFlightRequestURL, "URL");
      await axios.patch(updateFlightRequestURL, {
        totalSeats: totalSeats - booking.noOfSeats,
      });
      const finalBooking = await this.bookingRepository.update(booking.id, {
        status: "Booked",
      });
      return finalBooking;
    } catch (error) {
      if (error.name == "RepositoryError" || error.name == "ValidationError") {
        throw error;
      }
      throw new ServiceError();
    }
  }
}

module.exports = BookingService;
