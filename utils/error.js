export const errorHandler = (
  error,
  res,
  status = 500,
  message = "Error processing message"
) => {
  console.error(
    "Error sending message:",
    error.response ? error.response.data : error.message
  );
  res.status(status).send(message);
};
