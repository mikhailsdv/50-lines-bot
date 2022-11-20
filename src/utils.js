const getUserString = (from) => {
  return `${from.first_name}${from.last_name ? ` ${from.last_name}` : ''}${from.username ? ` @${from.username}` : ''}`
}
const wait = delay => new Promise(resolve => setTimeout(resolve, delay))

const trim = str => str.replace(/\t+|^\n+|\n+$/g, "")

module.exports = {
  getUserString,
  wait,
  trim
}
