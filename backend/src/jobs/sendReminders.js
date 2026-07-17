const cron = require("node-cron");
const db = require("../config/db");
const { sendNotification } = require("../services/notificationService");
const { formatDate, isValidDate } = require("../utils/dateUtils");

cron.schedule("0 8 * * *", async () => {
  try {
    const result = await db.query(`
      SELECT
        id,
        customer_name,
        customer_email,
        customer_phone,
        booking_status,
        COALESCE(advance_amount, 0) AS advance_amount,
        COALESCE(total_amount, 0) AS total_amount,
        created_at
      FROM bookings
      WHERE COALESCE(advance_amount, 0) < COALESCE(total_amount, 0)
      AND booking_status <> 'Released'
      ORDER BY created_at DESC
      LIMIT 50
    `);

    for (const booking of result.rows) {
      const due = Number(booking.total_amount) - Number(booking.advance_amount);
      const createdAt = isValidDate(booking.created_at)
        ? formatDate(booking.created_at)
        : "unknown date";

      const message = `Reminder: Booking ${booking.id} for ${booking.customer_name} has an outstanding balance of ${due.toFixed(2)}. Booking created on ${createdAt}.`;
      sendNotification(message);
    }

    if (result.rowCount > 0) {
      console.log(`sendReminders: processed ${result.rowCount} outstanding booking(s).`);
    }
  } catch (err) {
    console.error("sendReminders job failed:", err);
  }
});
