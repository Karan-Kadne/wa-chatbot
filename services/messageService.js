import axios from "axios";
import { WHATSAPP_TOKEN } from "../config/config.js";

import { PHONE_NUMBER } from "../config/config.js";

import fs, { write } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const handleGreeting = async ({ phone_number_id, from, id, res, name}) => {
  try {
    // const responseMessage = `Hello ${name}! How can I assist you today?`;
    await axios({
      method: "POST",
      url: `https://graph.facebook.com/v20.0/${phone_number_id}/messages`,
      headers: {
        Authorization: `Bearer ${WHATSAPP_TOKEN}`,
      },
      data: {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: from,
        context: {
          message_id: id,
        },
        text: {
          preview_url: false,
          body: `Hello ${name}! How can I assist you today?`,
        },
      },
    });

    //Datbase query to store new user or send respnse for existing user 

    // Select Option List
    await axios({
      method: "POST",
      url: `https://graph.facebook.com/v20.0/${phone_number_id}/messages`,
      headers: {
        Authorization: `Bearer ${WHATSAPP_TOKEN}`,
      },
      data: {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: from,
        type: "interactive",

        interactive: {
          type: "list",
          header: {
            type: "text",
            text: "Alphonsol Pvt Ltd",
          },
          body: {
            text: "Please select from below options",
          },
          footer: {
            text: "test footer",
          },
          action: {
            button: "What you want to do?",
            sections: [
              {
                title: "Contact Us 1",
                rows: [
                  {
                    id: "contact_1",
                    title: "Contact Us",
                    // description: "<SECTION_1_ROW_1_DESC>",
                  },
                  {
                    id: "location",
                    title: "Know Our Location",
                    // description: "These are all our services",
                  },
                  {
                    id: "upload_doc",
                    title: "Upload Document",
                    // description: "These are all our services",
                  },
                  {
                    id: "book_appointment",
                    title: "Book Appointment",
                    // description: "These are all our services",
                  },
                  {
                    id: "reschedule_appointment",
                    title: "Reschedule Appointment",
                    // description: "These are all our services",
                  },
                ],
              },
              // {
              //   title: "Services",
              //   rows: [
              //     {
              //       id: "contact_1",
              //       title: "testinggg",
              //       // description: "<SECTION_1_ROW_1_DESC>",
              //     },
              //     {
              //       id: "know_services",
              //       title: "Know Our Services",
              //       description: "These are all our services",
              //     },
              //   ],
              // },
              // {
              //   title: "<LIST_SECTION_2_TITLE>",
              //   rows: [
              //     {
              //       id: "<LIST_SECTION_2_ROW_1_ID>",
              //       title: "<SECTION_2_ROW_1_TITLE>",
              //       description: "<SECTION_2_ROW_1_DESC>",
              //     },
              //     {
              //       id: "<LIST_SECTION_2_ROW_2_ID>",
              //       title: "<SECTION_2_ROW_2_TITLE>",
              //       description: "<SECTION_2_ROW_2_DESC>",
              //     },
              //   ],
              // },
            ],
          },
        },
      },
    });
    res.sendStatus(200);
  } catch (error) {
    console.error(
      "Error sending in Greeting:",
      error.response ? error.response.data : error.message
    );
    res.sendStatus(400);
  }
};

export const handleInitialMessage = async ({ phone_number_id, from, id, res, name}) => {
  try {
    // const responseMessage = `Hello ${name}! How can I assist you today?`;
    await axios({
      method: "POST",
      url: `https://graph.facebook.com/v20.0/${phone_number_id}/messages`,
      headers: {
        Authorization: `Bearer ${WHATSAPP_TOKEN}`,
      },
      data: {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: from,
        context: {
          message_id: id,
        },
        text: {
          preview_url: false,
          body: `Hello! How are you?`,
        },
      },
    });
    
    res.sendStatus(200);
  } catch (error) {
    console.error(
      "Error sending in Initial Message:",
      error.response ? error.response.data : error.message
    );
    res.sendStatus(400);
  }
};

export const handleUnmatchedMessage = async ({
  phone_number_id,
  from,
  id,
  res,
}) => {
  try {
    await axios({
      method: "POST",
      url: `https://graph.facebook.com/v20.0/${phone_number_id}/messages`,
      headers: {
        Authorization: `Bearer ${WHATSAPP_TOKEN}`,
      },
      data: {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: from,
        context: {
          message_id: id,
        },
        text: {
          preview_url: false,
          body: "Please type hello or hi or hey",
        },
      },
    });
    res.sendStatus(200);
  } catch (error) {
    console.error(
      "Error sending in Unmatched:",
      error.response ? error.response.data : error.message
    );
    res.sendStatus(400);
  }
};

export const handleListMessage = async (
  message,
  { phone_number_id, from, id, res }
) => {
  try {
    // console.log(message);
    console.log(message.interactive.list_reply.id);

    if (message.interactive.list_reply.id === "location") {
      // This is for Location key
      // if(message.list_reply.id)
      await axios({
        method: "POST",
        url: `https://graph.facebook.com/v20.0/${phone_number_id}/messages`,
        headers: {
          Authorization: `Bearer ${WHATSAPP_TOKEN}`,
        },
        data: {
          messaging_product: "whatsapp",
          to: from,
          type: "location",
          location: {
            latitude: "19.217051120556615", // dummy cordinates
            longitude: "72.9807472711638",
            name: "Alphonsol Pvt Ltd",
            address: "High Street Corporate Center SB -10, Kapurbawadi, Junction, 400601, Majiwada, Thane, Maharashtra 400601",
          },
        },
      });
      await axios({
        method: "POST",
        url: `https://graph.facebook.com/v20.0/${phone_number_id}/messages`,
        headers: {
          Authorization: `Bearer ${WHATSAPP_TOKEN}`,
        },
        data: {
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: from,
          type: "interactive",

          interactive: {
            type: "button",
            body: {
              text: "Are you interested in anything else?",
            },
            action: {
              buttons: [
                {
                  type: "reply",
                  reply: {
                    id: "yes",
                    title: "Yes, Please",
                  },
                },
                {
                  type: "reply",
                  reply: {
                    id: "no",
                    title: "No, Thank You",
                  },
                },
              ],
            },
          },
        },
      });
    } else if (message.interactive.list_reply.id === "contact_1") {
      await axios({
        method: "POST",
        url: `https://graph.facebook.com/v20.0/${phone_number_id}/messages`,
        headers: {
          Authorization: `Bearer ${WHATSAPP_TOKEN}`,
        },
        data: {
          messaging_product: "whatsapp",
          to: from,
          type: "template",
          template: {
            name: "contact_us",
            language: {
              code: "en_US",
            },
            components: [],
          },
        },
      });

      await axios({
        method: "POST",
        url: `https://graph.facebook.com/v20.0/${phone_number_id}/messages`,
        headers: {
          Authorization: `Bearer ${WHATSAPP_TOKEN}`,
        },
        data: {
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: from,
          type: "interactive",

          interactive: {
            type: "button",
            body: {
              text: "Are you interested in anything else?",
            },
            action: {
              buttons: [
                {
                  type: "reply",
                  reply: {
                    id: "yes",
                    title: "Yes, Please",
                  },
                },
                {
                  type: "reply",
                  reply: {
                    id: "no",
                    title: "No, Thank You",
                  },
                },
              ],
            },
          },
        },
      });
      
    } else if (message.interactive.list_reply.id === "upload_doc") {
      console.log("Upload Document Block");
      await axios({
        method: "POST",
        url: `https://graph.facebook.com/v20.0/${phone_number_id}/messages`,
        headers: {
          Authorization: `Bearer ${WHATSAPP_TOKEN}`,
        },
        data: {
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: from,
          type: "interactive",
          interactive: {
            type: "button",
            body: {
              text: "Upload Your Documents Here",
            },
            action: {
              buttons: [
                {
                  type: "reply",
                  reply: {
                    id: "img_btn",
                    title: "Image",
                  },
                },
                {
                  type: "reply",
                  reply: {
                    id: "pdf_btn",
                    title: "Pdf",
                  },
                },
                {
                  type: "reply",
                  reply: {
                    id: "excel_btn",
                    title: "Excel",
                  },
                },
              ],
            },
          },
        },
      });
      // await axios({
      //   method: "POST",
      //   url: `https://graph.facebook.com/v20.0/${phone_number_id}/messages`,
      //   headers: {
      //     Authorization: `Bearer ${WHATSAPP_TOKEN}`,
      //   },
      //   data: {
      //     messaging_product: "whatsapp",
      //     recipient_type: "individual",
      //     to: from,
      //     context: {
      //       message_id: id,
      //     },
      //     text: {
      //       preview_url: false,
      //       body: "Please Upload Your PDF Document",
      //     },
      //   },
      // });
    }
    else if (message.interactive.list_reply.id === "book_appointment") {
      console.log("Appointment Booking Block");
      await axios({
        method: "POST",
        url: `https://graph.facebook.com/v20.0/${phone_number_id}/messages`,
        headers: {
          Authorization: `Bearer ${WHATSAPP_TOKEN}`,
        },
        data: {
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: from,
          type: "interactive",
          interactive: {
            type: "button",
            body: {
              text: "Where would you like to book appointment?",
            },
            action: {
              buttons: [
                {
                  type: "reply",
                  reply: {
                    id: "home_btn",
                    title: "Home",
                  },
                },
                {
                  type: "reply",
                  reply: {
                    id: "centre_btn",
                    title: "DC Centre",
                  },
                },
                // {
                //   type: "reply",
                //   reply: {
                //     id: "excel_btn",
                //     title: "Excel",
                //   },
                // },
              ],
            },
          },
        },
      });
    }
    res.sendStatus(200);
  } catch (error) {
    console.error(
      "Error sending in List Message:",
      error.response ? error.response.data : error.message
    );
    res.sendStatus(400);
  }
};

export const handleImage = async (   
  
  { phone_number_id, from, id, res , name},
  image
) => {
  try {
    console.log("in controller image", image);
    // console.log(image);
    
    const mediaId = image.id;
    const response = await axios({
      method: "GET",
  
      url: `https://graph.facebook.com/v20.0/${mediaId}`,
      headers: {
        Authorization: `Bearer ${WHATSAPP_TOKEN}`,
      },
    });
    console.log(response.data.url);
  
    const mediaURL = response.data.url;
  
    // Handle Media Download
  
    if (mediaURL){
      const response = await axios({
        method: "GET",
        responseType: "stream",
        url: `${mediaURL}`,
        headers: {
          Authorization: `Bearer ${WHATSAPP_TOKEN}`,
        },
      });


      const imagename = `${name}_passport.jpeg`
      const filePath = path.resolve(
        __dirname,
        "../downloads",
      imagename,

        
        
      );
      console.log(filePath);

      fs.mkdirSync(path.dirname(filePath), { recursive: true });

      const writer = fs.createWriteStream(filePath);

      response.data.pipe(writer);

      writer.on("finish", () => {
        console.log(
          `Download completed and saved as ${imagename}`
        );
      });

      writer.on("error", (err) =>{
        console.error("Error writing this file :", err);
      });
    }
    res.sendStatus(200);
  }
  catch (error) {
    console.log(error);

    console.error(
      "Error Handling Image",
      error.response ? error.response.data : error.message
    );
    res.sendStatus(400);
  }
  
};

export const handleDocument = async (
  { phone_number_id, from, id, res },
  document
) => {
  try {
    console.log("in controller document", document);
    const mediaId = document.id;
    const response = await axios({
      method: "GET",

      url: `https://graph.facebook.com/v20.0/${mediaId}`,
      headers: {
        Authorization: `Bearer ${WHATSAPP_TOKEN}`,
      },
    });
    console.log(response.data.url);

    const mediaURL = response.data.url;

    // Handle Media Download

    if (mediaURL) {
      const response = await axios({
        method: "GET",
        responseType: "stream",
        url: `${mediaURL}`,
        headers: {
          Authorization: `Bearer ${WHATSAPP_TOKEN}`,
        },
      });

      const filePath = path.resolve(
        __dirname,
        "../downloads",
        `${document.filename}`
      );
      console.log(filePath);

      fs.mkdirSync(path.dirname(filePath), { recursive: true });

      const writer = fs.createWriteStream(filePath);

      response.data.pipe(writer);

      writer.on("finish", () => {
        
        console.log(
          `Download completed successfully and saved as ${document.filename}`
        );
        
      });
      

      writer.on("error", (err) => {
        console.error("Error writing the file:", err);
      });
    }
    res.sendStatus(200);
  } 
  catch (error) {
    console.log(error);

    console.error(
      "Error Handling Document",
      error.response ? error.response.data : error.message
    );
    res.sendStatus(400);
  }
};
