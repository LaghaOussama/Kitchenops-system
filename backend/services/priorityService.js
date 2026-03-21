const calculatePriority = (command) => {
  let priority = 0;

  const now = new Date();
  const createdAt = new Date(command.createdAt);

  const diffMinutes = (now - createdAt) / 60000;

  // attente longue
  if (diffMinutes > 10) priority += 2;

  // grosse commande
  if (command.items.length > 3) priority += 1;

  return priority;
};

module.exports = calculatePriority;
