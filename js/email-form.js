

(function () {
emailjs.init("TM3TNkeZio4PpQ4DX");
})();
function sendEmail(event) {
event.preventDefault(); 
const serviceID = "service_vp3f96k"; 
const templateID = "template_649wgkh"; 
emailjs.sendForm(serviceID, templateID, event.target)
.then(() => {
alert("Your Message sent successfully!");
})
.catch((error) => {
console.error("Failed to send email:", error);
alert("Oops! Something went wrong.");
});
}

