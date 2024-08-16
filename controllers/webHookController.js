import axios from "axios";
import {
  handleDocument,
  handleListMessage,
  handleImage,
} from "../services/messageService.js";
import {
  handleInitialMessage,
  handleGreeting,
  handleUnmatchedMessage,
} from "../services/messageService.js";
import { WHATSAPP_TOKEN } from "../config/config.js";

import { PHONE_NUMBER } from "../config/config.js";


import readExcel from 'read-excel-file/node' 

// const processedMessages = new Set();

export const webHookController = async (req, res) => 
{
  try 
  {
    const { object, entry } = req.body;

    if (!object || !entry?.[0]?.changes?.[0]?.value?.messages?.[0]) 
    {
      return res.status(400).send("Invalid request body");
    }

    const { changes } = entry[0];
    const { value } = changes[0];
    const { messages, metadata, contacts } = value;
    const message = messages[0];

    const phone_number_id = metadata.phone_number_id;
    const from = message.from;
    const messageType = message.type;
    const name = contacts[0]?.profile?.name;
    const id = message.id;

    const userInformation = 
    {
      phone_number_id,
      from,
      messageType,
      id,
      res,
      name,
    };

    // Check for duplicate messages
    // if (processedMessages.has(id)) {
    //   console.log("Duplicate message:", id);
    //   return res.sendStatus(200);
    // }

    // console.log(message);

    // Process the message
    switch (messageType) 
    {
      case "text":
      const msgBody = message.text?.body;
      const greetings = ["hi", "hello", "hey"];
      
      const bulkMsg = ["greetall"];
      if (bulkMsg.some((greeting) => msgBody.toLowerCase() === greeting) && PHONE_NUMBER === from) 
      {
        // handleInitialMessage(userInformation);
        let users = [];

        readExcel( './static/details.xlsx' ).then( ( rows ) => {
          const keys = rows[0];
         
          const phoneIndex=keys[4]
          console.log(phoneIndex);
          rows.shift();
          
          rows.forEach( async ( row ) => {
            let contacts = row[4];
            console.log(contacts);
            
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
                  to: contacts,
                  context: {
                    message_id: id,
                  },
                  text: {
                    preview_url: false,
                    body: `This is sample of bulk msg send to all users saved in excel`,
                  },
                },
              });
              // Select Option List
              // res.sendStatus(200);
            } 
            catch (error) {
              console.error(
                "Error sending in Greeting:",
                error.response ? error.response.data : error.message
              );
              // res.sendStatus(400);
            }
          });
      
          // sendMessage( users, 'hey {{name}}' );
          // console.log(users);
          
        } );
      
        return
      }
      

      if (greetings.some((greeting) => msgBody.toLowerCase() === greeting)) 
      {
        handleGreeting(userInformation);
      } else 
      {
        handleUnmatchedMessage(userInformation);
      }
      break;

      

      case "interactive":
      const listType = message.interactive.type;
      console.log(listType)
      if (listType === "list_reply") 
      {
        handleListMessage(message, userInformation);
      }
      else if (listType === "button_reply") 
      {
        // handleListMessage(message, userInformation);
        if (message.interactive.button_reply.id === "no") 
        {
          await axios({
            method: "POST",
            url: `https://graph.facebook.com/v20.0/${phone_number_id}/messages`,
            headers: {
              Authorization: `Bearer ${WHATSAPP_TOKEN}`,
            },
            data: 
            {
              messaging_product: "whatsapp",
              to: from,
              type: "template",
              template: 
              {
                name: "thank_you",
                language: 
                {
                  code: "en_US",
                },
                components: [],
              },
            },
          });
          await axios(
          {
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
                name: "contact_back",
                language: {
                  code: "en_US",
                },
                components: [],
              },
            },
          });
        }
        else if (message.interactive.button_reply.id === "yes")
        {
          // const responseMessage = "Okay what would you like to do";
          // await axios(
          // {
          //   method: "POST",
          //   url: `https://graph.facebook.com/v20.0/${phone_number_id}/messages`,
          //   headers: {
          //     Authorization: `Bearer ${WHATSAPP_TOKEN}`,
          //   },
          //   data: {
          //     messaging_product: "whatsapp",
          //     to: from,
          //     text: { body: responseMessage },
          //   },
          // });
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
            
              interactive: 
              {
                type: "list",
                header: {
                  type: "text",
                  text: "Alphonsol Pvt Ltd",
                },
                body: {
                  text: "Please select what would you like to do from below options",
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
                        },
                        {
                          id: "upload_doc",
                          title: "Upload Documents",
                        },
                      ],
                    },
                  ],
                },
              },
            },
          });
        }
        else if (message.interactive.button_reply.id === "pdf_btn")
        {
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
                body: "Please Upload Your Document",
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
        }
        else if (message.interactive.button_reply.id === "excel_btn")
        {
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
                  body: "Please Upload Your Document",
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
        }
        else if (message.interactive.button_reply.id === "img_btn")
        {
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
                  body: "Please Upload Your Passport Size Photo",
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
        }
        else if (message.interactive.button_reply.id === "home_btn")
          {
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
                    body: "Ok Great we will get back to you soon!!!",
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
                    text: "In which centre you would like to book your appointment?",
                  },
                  action: {
                    buttons: [
                      {
                        type: "reply",
                        reply: {
                          id: "dc_1",
                          title: "DC 1",
                        },
                      },
                      {
                        type: "reply",
                        reply: {
                          id: "dc_2",
                          title: "DC 2",
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
            // await axios({
            //     method: "POST",
            //     url: `https://graph.facebook.com/v20.0/${phone_number_id}/messages`,
            //     headers: {
            //       Authorization: `Bearer ${WHATSAPP_TOKEN}`,
            //     },
            //     data: {
            //       messaging_product: "whatsapp",
            //       recipient_type: "individual",
            //       to: from,
            //       type: "interactive",
        
            //       interactive: {
            //         type: "button",
            //         body: {
            //           text: "Are you interested in anything else?",
            //         },
            //         action: {
            //           buttons: [
            //             {
            //               type: "reply",
            //               reply: {
            //                 id: "yes",
            //                 title: "Yes, Please",
            //               },
            //             },
            //             {
            //               type: "reply",
            //               reply: {
            //                 id: "no",
            //                 title: "No, Thank You",
            //               },
            //             },
            //           ],
            //         },
            //       },
            //     },
            // });
        }
        else if (message.interactive.button_reply.id === "centre_btn")
          {
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
                    body: "We are currently working on it.",
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
        }
        else if (message.interactive.button_reply.id === "dc_1")
          {
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
                    body: "We are currently working on it.",
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
        }
        else if (message.interactive.button_reply.id === "dc_2")
          {
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
                    body: "We are currently working on it.",
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
        }
      }
      
      break;
      case "document":

      console.log(message);
      const document = message.document;
      // console.log("Got Document", document);
      handleDocument(userInformation, document);
      
      // const documentType = message.interactive.type;
      // if (documentType === "list_reply") {
      //   handleListMessage(message, userInformation);
      // }
      break;

      case "image":
        
      console.log(message);
      const image = message.image;
      handleImage(userInformation, image);
      break;
      default:
      
      
      return res.status(400).send("Invalid message type");
    }   
    // Mark message as processed
    // processedMessages.add(id);
  } catch (error) 
  {
    console.error("Error processing webhook:", error);
    res.sendStatus(500); // Or handle error more gracefully
  }
};
