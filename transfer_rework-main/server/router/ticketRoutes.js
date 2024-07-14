const Router = require('express').Router;
const Ticket = require('../models/Ticket');
const QRCode = require('qrcode');
const ticketService = require('../service/ticket-service');

const router = new Router();

// Створення квитка
router.post('/tickets', async (req, res) => {
  try {
    const formatDate = (dateString) => {
      const [day, month, year] = dateString.split('.');
      return new Date(`${year}-${month}-${day}`);
    };

    const ticketData = {
      ...req.body,
      date_departure: formatDate(req.body.date_departure),
      date_arrival: formatDate(req.body.date_arrival),
    };

    const ticket = new Ticket(ticketData);
    await ticket.save();

    const qrCodeData = JSON.stringify({ id: ticket._id });
    const qrCodeImage = await QRCode.toDataURL(qrCodeData);

    await ticketService.sendTicketMail(req.body.email, ticketData, qrCodeImage);
    res.status(201).json(ticket);
  } catch (error) {
    console.error('Error creating ticket:', error);
    res.status(500).json({ message: 'Error creating ticket', error });
  }
});

// Оновлення статусу квитка (активний/неактивний)
router.put('/tickets/toggle/:id', async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    ticket.isActive = !ticket.isActive;
    await ticket.save();
    res.json(ticket);
  } catch (error) {
    console.error('Error toggling ticket status:', error);
    res.status(500).json({ message: 'Error toggling ticket status', error });
  }
});

// Маршрут для генерації QR-коду за ID квитка
router.get('/tickets/qrcode/:id', async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    const ticketData = {
      id: ticket._id,
      from: ticket.from,
      to: ticket.to,
      date_departure: ticket.date_departure,
      isActive: ticket.isActive
    };

    const qrCodeData = JSON.stringify(ticketData);
    const qrCodeImage = await QRCode.toDataURL(qrCodeData);

    res.json({ qrCodeImage });
  } catch (error) {
    console.error('Error generating QR code:', error);
    res.status(500).json({ message: 'Error generating QR code', error });
  }
});

module.exports = router;
// Отримання всіх майбутніх квитків
router.get('/tickets', async (req, res) => {
  try {
    const today = new Date();
    const tickets = await Ticket.find({ date_departure: { $gte: today } });
    res.json(tickets);
  } catch (error) {
    console.error('Error fetching tickets:', error);
    res.status(500).json({ message: 'Error fetching tickets', error });
  }
});

module.exports = router;
