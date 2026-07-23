<?php

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // Receive form data
    $name = htmlspecialchars($_POST["Name"]);
    $email = htmlspecialchars($_POST["Email"]);
    $phone = htmlspecialchars($_POST["Phone"]);
    $product = htmlspecialchars($_POST["Product"]);
    $message = htmlspecialchars($_POST["Message"]);

    // Your email address
    $to = "dmchemicals77@gmail.com";

    // Email subject
    $subject = "New Enquiry from DM Chemicals Website";

    // Email body
    $email_body = "You have received a new enquiry from your website.\n\n";

    $email_body .= "Name: " . $name . "\n";
    $email_body .= "Email: " . $email . "\n";
    $email_body .= "Phone: " . $phone . "\n";
    $email_body .= "Product: " . $product . "\n";
    $email_body .= "Message: " . $message . "\n";

    // Email headers
    $headers = "From: website@yourdomain.com\r\n";
    $headers .= "Reply-To: " . $email . "\r\n";

    // Send email
    if (mail($to, $subject, $email_body, $headers)) {

        echo "
        <script>
            alert('Thank you! Your enquiry has been sent successfully.');
            window.location.href = 'index.html#contact';
        </script>
        ";

    } else {

        echo "
        <script>
            alert('Sorry, something went wrong. Please try again.');
            window.location.href = 'index.html#contact';
        </script>
        ";
    }

}

?>