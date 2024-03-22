function dataProcessing(data) {
  if (data.accelerometer.y < 55) {
    return 'pit'
  } else if (data.accelerometer.y > 95) {
    return 'hump'
  }
  return 'normal'
}

export default dataProcessing
