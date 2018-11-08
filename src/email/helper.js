const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = {
    accountConfirmation(user){
        if(process.env.NODE_ENV === "test"){
            console.log("confirmation emails suppressed");
        } else {
            const msg = {
                to: `${user.email}`,
                from: "noreply@blocipedia.com",
                subject: `Welcome to Blocipedia ${user.name}!`,
                text: "Your account has been successfully created!",
                html: "<strong>Start creating wikis now!<stong>"
            };
            sgMail.send(msg);
        }
    }
}