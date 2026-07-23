export default async function handler(request) {
    // Only allow POST requests
    if (request.method !== "POST") {
        return new Response(
            JSON.stringify({
                success: false,
                message: "Method not allowed"
            }),
            {
                status: 405,
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );
    }

    try {
        // Receive form data from the frontend
        const data = await request.json();

        const {
            name,
            email,
            phone,
            product,
            message
        } = data;

        // Basic validation
        if (!name || !email || !message) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Please fill in all required fields."
                }),
                {
                    status: 400,
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );
        }

        // Send email through Resend
        const response = await fetch(
            "https://api.resend.com/emails",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",

                    "Authorization":
                        `Bearer ${process.env.RESEND_API_KEY}`
                },

                body: JSON.stringify({

                    from: "DM Chemicals Website <onboarding@resend.dev>",

                    to: [
                        "dmchemicals77@gmail.com"
                    ],

                    subject:
                        "New Enquiry from DM Chemicals Website",

                    html: `
                        <h2>New Customer Enquiry</h2>

                        <p>
                            <strong>Name:</strong>
                            ${name}
                        </p>

                        <p>
                            <strong>Email:</strong>
                            ${email}
                        </p>

                        <p>
                            <strong>Phone:</strong>
                            ${phone || "Not provided"}
                        </p>

                        <p>
                            <strong>Product:</strong>
                            ${product || "Not selected"}
                        </p>

                        <p>
                            <strong>Message:</strong>
                            ${message}
                        </p>
                    `
                })
            }
        );

        const result = await response.json();

        if (!response.ok) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Email could not be sent.",
                    error: result
                }),
                {
                    status: 500,
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );
        }

        return new Response(
            JSON.stringify({
                success: true,
                message: "Enquiry sent successfully!"
            }),
            {
                status: 200,
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );

    } catch (error) {

        return new Response(
            JSON.stringify({
                success: false,
                message: "Server error occurred."
            }),
            {
                status: 500,
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );
    }
}