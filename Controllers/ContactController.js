import Contact from "../Models/ContactModal.js";

export const saveContactForm = async (req, res) => {
  const { firstName, lastName, email, phone, message } = req.body;

  if (!firstName || !lastName || !email || !message) {
    return res
      .status(400)
      .json({ message: "Please fill in all required fields" });
  }

  const contact = new Contact({
    firstName,
    lastName,
    email,
    phone,
    message,
  });

  try {
    await contact.save();
    return res
      .status(200)
      .json({ message: "Contact form data saved successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};
