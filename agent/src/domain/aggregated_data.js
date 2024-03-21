function aggregated_data({ gps, accelerometer, user_id }) {
  return { gps, accelerometer, user_id, timestamp: new Date().toISOString() }
}

export default aggregated_data