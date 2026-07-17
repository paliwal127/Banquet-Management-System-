const formatMeta = (meta) => {
  if (!meta) return "";
  try {
    return JSON.stringify(meta);
  } catch {
    return String(meta);
  }
};

const timestamp = () => new Date().toISOString();

const log = (level, message, meta) => {
  const formattedMessage = `[${level}] ${timestamp()} - ${message}`;
  if (meta) {
    console[level](`${formattedMessage} ${formatMeta(meta)}`);
  } else {
    console[level](formattedMessage);
  }
};

const info = (message, meta) => log("info", message, meta);
const warn = (message, meta) => log("warn", message, meta);
const error = (message, meta) => log("error", message, meta);

module.exports = {
  info,
  warn,
  error
};
