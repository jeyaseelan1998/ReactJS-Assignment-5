import Header from '../Header'

const JobDetails = props => {
  const {
    match: {
      params: {id},
    },
  } = props

  return (
    <div className="route-bg-container">
      <Header />
      <h1>JobDetails Route : {id}</h1>
    </div>
  )
}

export default JobDetails
