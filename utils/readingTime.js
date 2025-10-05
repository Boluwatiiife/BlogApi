// simple reading time algorithm: words / 200 wpm

function compute_reading_time(text) {
  if (!text) return 0;
  const words = text.trim().split(/\s+/).length;
  const wpm = 200;
  return Math.max(1, Math.ceil(words / wpm)); // at least one mintute
}

module.exports = { compute_reading_time };
