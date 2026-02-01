const Notification = ({ message, type }) => {
  if (message === null) {
    return null
  }

  const className = `notification ${type === 'error' ? 'error' : 'success'}`

  return (
    <div className={className}>
      {message}
    </div>
  )
}
export default Notification