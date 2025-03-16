const formatDate = (dateString) => {
  // Define options for formatting the date
  const options = { year: "numeric", month: "long", day: "numeric" };
  // Convert the date string to a Date object
  const date = new Date(dateString);
  // Format the date using specified options
  const formattedDate = date.toLocaleDateString("en-US", options);

  // Extract hours from the date object
  const hour = date.getHours();
  // Extract minutes from the date object
  const minutes = date.getMinutes();
  // Determine whether it's AM or PM based on the hour
  const period = hour >= 12 ? "PM" : "AM";
  // Format the time in 12-hour clock format
  const formattedTime = `${hour % 12}:${minutes
    .toString()
    .padStart(2, "0")} ${period}`;

  // Combine formatted date and time into a single string
  return `${formattedDate} | ${formattedTime}`;
};

const formattedDate = (date) => {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

export { formatDate, formattedDate };
