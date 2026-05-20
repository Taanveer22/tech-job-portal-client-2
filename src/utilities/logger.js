const logger = {
  log: (...args) => import.meta.env.DEV && console.log(...args),
  error: (...args) => import.meta.env.DEV && console.error(...args),
};

export default logger;
