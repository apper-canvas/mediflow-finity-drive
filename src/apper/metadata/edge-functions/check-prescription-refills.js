import apper from "https://cdn.apper.io/actions/apper-actions.js";
import { Resend } from "npm:resend";

apper.serve(async (req) => {
  try {
    const resendApiKey = await apper.getSecret("RESEND_API_KEY");
    
    if (!resendApiKey) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "RESEND_API_KEY secret not configured"
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    const resend = new Resend(resendApiKey);

    const prescriptionsResponse = await fetch(
      `${req.headers.get("origin")}/src/services/mockData/prescriptions.json`
    );

    if (!prescriptionsResponse.ok) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Failed to fetch prescriptions data"
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    const prescriptions = await prescriptionsResponse.json();

    const today = new Date();
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + 7);

    const dueForRefill = prescriptions.filter((p) => {
      if (p.status !== "Active") return false;
      const refillDate = new Date(p.refillDate);
      return refillDate >= today && refillDate <= futureDate;
    });

    if (dueForRefill.length === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          message: "No prescriptions due for refill",
          count: 0
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    const emailPromises = dueForRefill.map(async (prescription) => {
      const daysUntilRefill = Math.ceil(
        (new Date(prescription.refillDate) - today) / (1000 * 60 * 60 * 24)
      );

      try {
        await resend.emails.send({
          from: "MediFlow <notifications@yourdomain.com>",
          to: "patient@example.com",
          subject: `Prescription Refill Reminder - ${prescription.medicationName}`,
          html: `
            <h2>Prescription Refill Reminder</h2>
            <p>Your prescription for <strong>${prescription.medicationName}</strong> is due for refill in ${daysUntilRefill} days.</p>
            <p><strong>Details:</strong></p>
            <ul>
              <li>Medication: ${prescription.medicationName}</li>
              <li>Dosage: ${prescription.dosage}</li>
              <li>Refill Date: ${new Date(prescription.refillDate).toLocaleDateString()}</li>
              <li>Refills Remaining: ${prescription.refillsRemaining}</li>
              <li>Prescribed By: ${prescription.prescribedBy}</li>
            </ul>
            <p>Please contact your healthcare provider to arrange your refill.</p>
          `
        });
        return { success: true, prescriptionId: prescription.Id };
      } catch (error) {
        return { success: false, prescriptionId: prescription.Id, error: error.message };
      }
    });

    const results = await Promise.all(emailPromises);
    const successCount = results.filter((r) => r.success).length;

    return new Response(
      JSON.stringify({
        success: true,
        message: `Processed ${dueForRefill.length} prescriptions, ${successCount} notifications sent`,
        results
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
});